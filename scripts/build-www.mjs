// Copies the web game (kept at the repo root so the PWA keeps working)
// into www/, which Capacitor bundles into the iOS app.
import { cpSync, mkdirSync, rmSync } from 'node:fs';

const FILES = [
  'index.html',
  'manifest.json',
  'service-worker.js',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'stats.html',
];

rmSync('www', { recursive: true, force: true });
mkdirSync('www');
for (const f of FILES) cpSync(f, `www/${f}`);
console.log(`Copied ${FILES.length} files to www/`);
