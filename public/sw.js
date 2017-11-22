var shellName = "breathe01",
files = [
  "/",
  "/index.html",
  "/styles/style.css",
  "/scripts/app.js",
  "/resources/boy.jpg",
  "/resources/falcon.mp3"
]

self.addEventListener('install', function(e) {
          console.log('[ServiceWorker] Install');

  e.waitUntil(
    caches.open(shellName).then(function(cache) {
          console.log('[ServiceWorker] Caching app shell');

      return cache.addAll(files);
    })
  );
});

// offline serving
self.addEventListener('fetch', function(e) {

      console.log('[ServiceWorker] Fetch', e.request.url);

  e.respondWith(

      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
    })
  );
});