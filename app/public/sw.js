// WhatBin Service Worker — Stale-While-Revalidate Caching for Offline Shell
const CACHE_NAME = 'whatbin-shell-v4';

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.png',
  '/whatbin-background.webp',
  '/mascot-happy.webp',
  '/mascot-hero.webp',
  '/mascot-camera.webp',
  '/mascot-wink.webp',
  '/accent-spark-yellow.webp',
  '/accent-spark-teal.webp',
  '/api/items',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(SHELL_ASSETS).catch((err) => {
        console.warn('[SW] Cache addAll warning:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Check if request is one of the shell assets or static files
  const isMatch = SHELL_ASSETS.some((asset) => {
    if (asset === '/') return url.pathname === '/' || url.pathname === '/index.html';
    return url.pathname === asset;
  });

  if (isMatch) {
    // Stale-While-Revalidate strategy
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(req);
        const fetchPromise = fetch(req)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(req, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
