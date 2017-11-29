const shellName = "breathe_v01",
origin = "https://breathe1.herokuapp.com"
shellFiles = [
  //"/",
  "/index.html",
  "/styles/style.css",
  "/styles/lake1.jpg",
  "/scripts/app.js",
  "/scripts/webworker.js",
  //"/resources/falcon.mp3",
  "/resources/soundsnap_woodblock_BPM_100_5_SHRIEK_2011.mp3"
]

self.addEventListener('install', function(e) {
      console.log('[ServiceWorker] Install');

      // delete old caches
      //function delete(cb){
          /*caches.keys().then(ckeys=>{
              console.log("cacheKeys all")
              console.log(ckeys)

              var oldkeys = ckeys.filter(key=>{ return key !== shellName})
              var deletePromises = oldkeys.map(oldkey=>{ caches.delete(oldkey)})
              return Promise.all(deletePromises)
          })*/
          setTimeout(()=>{
                  /*e.waitUntil(
                        caches.open(shellName).then(function(cache) {
                              console.log('[ServiceWorker] installation: Caching app shell');

                              return cache.addAll(shellFiles);
                        })
                  );*/
            //console.log("timeout test");
          },2000)
      //}
      //delete(function(){
        e.waitUntil(
              caches.open(shellName)
                .then(function(cache) {
                    console.log('[ServiceWorker] installation: Caching app shell');

                    return cache.addAll(shellFiles);
                })
                .then(function() {
                  console.log('[install] All required resources have been cached');
                  return self.skipWaiting();
                })
        );
      //});
});



self.addEventListener('activate', function(e) {

      console.log('sw activated');
  
      e.waitUntil(
          caches.keys().then(function(cacheNames) {
            return Promise.all(
              cacheNames.map(function(cacheName) {
                console.log("activate: cache key filtering", cacheName);
                
                if (cacheName !== shellName) {
                  return caches.delete(cacheName);
                }
              })
            );
          })
      );
})


// offline serving
self.addEventListener('fetch', function(e) {

      //console.log('[ServiceWorker] Fetch for ', e.request.url,"\n",e.request)

      e.respondWith(fromNetwork(e.request.url, 400).catch(function () {
          return fromCache(e.request);
      }));
  
  
      function fromNetwork(request, timeout) {
            return new Promise(function (resolve, reject) {

                var timeoutId = setTimeout(reject, timeout);
                
                fetch(request).then(function (response) {
                    clearTimeout(timeoutId);
                    resolve(response);
                }, reject);
            });
      }
  
      function fromCache(request) {
        return caches.open(shellName).then(function (cache) {
          return cache.match(request).then(function (matching) {
            return matching || Promise.reject('no-match');
          });
        });
      }
  
  
      // try to get new version from network
      /*if (isShellFile()){
          console.log("it is app shell req >>", e.request.url)

          fetch(e.request.url).then(response =>{ 
                // add to cache
                if (response.ok){
                    var copy = response.clone()
                    caches.open(shellName).then(cache=>{
                      let fileUrl = e.request.url.replace(origin,"")
                      cache.put(fileUrl, copy)
                    })
                    return response
                } else {
                    console.log("fetch not successfull")
                    e.respondWith(
                    
                              caches.match(e.request).then(function(response) {
                                        console.log("caches match response",response)
                                return fetch(e.request) || response
                              })
                    );
                }
          }).catch(e=>{
              console.log("there was error in fetch event")
              console.error(e);
                //throw e
          })*/
          // add new files to cache?
          /*e.waitUntil(
            caches.open(shellName).then(function(cache) {
                  console.log('[ServiceWorker] Caching app shell');

                  return cache.addAll(shellFiles);
            })
          );*/
      //}
  
      //else { // get files from cache
             //console.log()
      function useCache(e){

            return  e.respondWith(
          
                    caches.match(e.request).then(function(response) {
                              console.log(response)
                        return fetch(e.request) || response
                    })
              );
      }       
      
      


  function isShellFile(){
    
    return shellFiles.some(function(fileURL){

                return e.request.url.includes(fileURL)
           })
    // if req url contains any of itmes in "files" arr
  }
});
