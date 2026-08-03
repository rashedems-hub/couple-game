const CACHE_NAME = 'couple-game-v1';
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for navigation/data, cache fallback for offline shell only.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if(req.method !== 'GET') return; // never cache POST/PUT/etc (Firebase calls)
  if(req.url.includes('firebaseio.com') || req.url.includes('googleapis.com') || req.url.includes('gstatic.com')){
    return; // let Firebase network requests pass through untouched
  }
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
