// RevenueCat → Firebase: keeps subscribers/{uid}/until in step with store subscriptions.
//
// RevenueCat calls this webhook on every subscription event (purchase, renewal,
// cancellation, expiration, transfer...). Instead of trusting the event body, we ask
// RevenueCat's API for the current state of each user the event mentions and write
// the entitlement's expiry date. The database rules already let a user save their own
// challenges only while subscribers/{uid}/until is in the future.
//
// Secrets (Firebase Secret Manager), set by the "Firebase functions" workflow:
//   REVENUECAT_WEBHOOK_AUTH  the Authorization header value set on the webhook in RevenueCat
//   REVENUECAT_SECRET_KEY    a RevenueCat secret API key (v1, starts with sk_)

const crypto = require('node:crypto');
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const logger = require('firebase-functions/logger');
const admin = require('firebase-admin');

admin.initializeApp();

const WEBHOOK_AUTH = defineSecret('REVENUECAT_WEBHOOK_AUTH');
const SECRET_KEY = defineSecret('REVENUECAT_SECRET_KEY');
const ENTITLEMENT = 'premium';
const LIFETIME = Date.UTC(2100, 0, 1);

function sameSecret(given, expected) {
  const a = Buffer.from(String(given));
  const b = Buffer.from(String(expected));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Firebase uids only: skips RevenueCat anonymous ids and anything that isn't a valid database key
function firebaseUids(event) {
  const ids = [
    event.app_user_id,
    event.original_app_user_id,
    ...(event.aliases || []),
    ...(event.transferred_from || []),
    ...(event.transferred_to || []),
  ];
  return [...new Set(ids)].filter(
    (id) => typeof id === 'string' && /^[A-Za-z0-9_-]{6,128}$/.test(id)
  );
}

async function premiumUntil(uid) {
  const res = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(uid)}`, {
    headers: { Authorization: `Bearer ${SECRET_KEY.value()}` },
  });
  if (!res.ok) throw new Error(`RevenueCat API ${res.status} for ${uid}`);
  const body = await res.json();
  const ent = body.subscriber && body.subscriber.entitlements && body.subscriber.entitlements[ENTITLEMENT];
  if (!ent) return 0;
  return ent.expires_date ? Date.parse(ent.expires_date) || 0 : LIFETIME;
}

async function writeUntil(uid, until) {
  await admin.database().ref(`subscribers/${uid}`).transaction((cur) => {
    // a subscription the admin granted by hand (no source) wins while it lasts longer
    if (cur && cur.source !== 'revenuecat' && (cur.until || 0) > until) return cur;
    return { until, source: 'revenuecat', updatedAt: Date.now() };
  });
}

exports.revenuecatWebhook = onRequest(
  { secrets: [WEBHOOK_AUTH, SECRET_KEY], region: 'us-central1', maxInstances: 5 },
  async (req, res) => {
    if (req.method !== 'POST') {
      res.status(405).send('Method not allowed');
      return;
    }
    if (!sameSecret(req.get('authorization') || '', WEBHOOK_AUTH.value())) {
      res.status(401).send('Unauthorized');
      return;
    }
    const event = req.body && req.body.event;
    if (!event || !event.type) {
      res.status(400).send('No event');
      return;
    }
    if (event.type === 'TEST') {
      logger.info('RevenueCat test event received');
      res.status(200).send('ok');
      return;
    }
    const uids = firebaseUids(event);
    try {
      for (const uid of uids) {
        const until = await premiumUntil(uid);
        await writeUntil(uid, until);
        logger.info('subscription synced', { type: event.type, uid, until });
      }
      res.status(200).send('ok');
    } catch (e) {
      // a non-2xx makes RevenueCat retry the webhook later
      logger.error('subscription sync failed', { type: event.type, error: String(e) });
      res.status(500).send('retry');
    }
  }
);
