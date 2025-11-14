self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('LiteBulb-cache').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/images/placeholder.jpg',
        'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css'
      ]);
    })
  );
});

self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});

window.addEventListener('online', syncOfflineData);