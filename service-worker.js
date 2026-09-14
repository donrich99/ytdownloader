/* ytdownloader service worker — v19 (network-first: laging fresh, cache lang kapag offline) */
'use strict';

var CACHE = 'ytdownloader-v19';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/style.css',
  './js/polyfills.js',
  './js/app.js',
  './js/api.js',
  './js/db.js',
  './assets/Ytdl.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon-180.png',
  './assets/favicon.ico'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  // same-origin lang ang hinahawakan (app shell + server.txt)
  if (url.origin === location.origin) {
    e.respondWith(
      // NETWORK-FIRST: palaging subukan ang network para laging fresh ang JS/HTML
      // (fallback sa cache kapag offline — kaya gumagana pa rin offline)
      fetch(e.request)
        .then(function (res) {
          if (res && res.ok && e.request.method === 'GET') {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) { return c.put(e.request, copy); });
          }
          return res;
        })
        .catch(function () {
          return caches.match(e.request).then(function (r) { return r || caches.match('./index.html'); });
        })
    );
    return;
  }
  // external (selfhost tunnel/API): pass through
});