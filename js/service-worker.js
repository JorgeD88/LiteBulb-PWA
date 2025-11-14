const CACHE_NAME = 'litebulb-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/manifest.json',
  '/images/Lightbulb.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
  'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

const CACHE_NAME = 'litebulb-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css',
  '/images/Lightbulb.jpg',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
  'https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js',
  'https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js',
  'https://cdn.jsdelivr.net/npm/idb@7/build/iife/index-min.js'
];