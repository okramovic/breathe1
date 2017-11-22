var shellName = "breathe02",
files = [
  "/",
  "/index.html",
  "/styles/style.css",
  "/scripts/app.js",
  "/resources/boy.jpg",
//  "/resources/falcon.mp3",
//  "https://cdn.glitch.com/b766c17a-7343-4964-a8e5-8496ed10e4bb%2FFalcon-Mark_Mattingly-169493032.mp3"
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
