var shellName = "breathe3",
files = [
  "/index.html",
  "/styles/style.css",
  "/styles/lake1.jpg",
  "/scripts/app.js",
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



self.addEventListener('activate', function(e) {

      console.log('sw activated');
})


// offline serving
self.addEventListener('fetch', function(e) {

      console.log('[ServiceWorker] Fetch for ', e.request.url);

  e.respondWith(

      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
    })
  );
});
