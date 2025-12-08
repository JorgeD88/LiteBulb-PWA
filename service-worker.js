const CACHE = "litebulb-cache-v2";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/tasks.html",
  "/guides.html",
  "/calendar.html",
  "/manifest.json",
  "/css/style.css",
  "/js/auth.js",
  "/js/tasks.js",
  "/js/index.js",
  "/js/calendar.js",
  "/images/lightbulb.jpg",
  "/images/gutter.jpg",
  "/images/icon-72.png",
  "/images/icon-96.png",
  "/images/icon-128.png",
  "/images/icon-192.png",
  "/images/icon-256.png",
  "/images/icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js",
  "https://fonts.googleapis.com/icon?family=Material+Icons"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Cache-first with dynamic caching and offline fallback
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        if (event.request.mode === "navigate") {
          return caches.match("/index.html");
        }
      });
    })
  );
});