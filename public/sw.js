const shellName = "breathe_v01.2",
origin = "https://breathe1.herokuapp.com"
shellFiles = [
  //"/",
  "/index.html",
  "/styles/style.css",
  "/styles/classes.css",
  "/styles/lake1.jpg",
  "/scripts/app.js",
  "/scripts/webworker.js",
  //
  "/resources/mynoise_korimako_new_zealand_1.mp3",
  "/resources/mynoise_birds_random_palmgarden.mp3",
  "/resources/mynoise_birds_coockoo.mp3",
  "/resources/mynoise_frogs_crickets_ricefield_mycookie.mp3",
  "/resources/soundsnap_bird_MYEDIT_LESSER_SHORT_TOED_LARK_SONG_KAZ_200502.mp3",
  "/resources/soundsnap_caxixi_BPM_130_12_SHRIEK_2011.mp3",
  "/resources/soundsnap_MODEM_DIAL_LOGON_AND_CONNECT_2_MYEDIT.mp3",
  "/resources/soundsnap_fax_11507101_receiving.mp3",
  "/resources/soundsnap_MYEDIT_CRYSTAL_WAND_ON_SINGING_BOWL.mp3",
  "/resources/soundsnap_MYEDIT_WINE_CORK_MALLET_DINGING_ON_SINGING_BOWL_LONG_HOLD.mp3",
  "/resources/soundsnap_TIBETAN_BOWL_SINGING_MYEDIT.mp3",
  "/resources/soundsnap_woodblock_BPM_100_5_SHRIEK_2011.mp3",
  "/resources/soundsnap_woodblock_BPM_100_9_SHRIEK_2011_MYEDIT.mp3",
  "/resources/soundsnap_woodblock_BPM_100_18_SHRIEK_2011.mp3",
  "/resources/soundsnap_woodblock_BPM_100_26_SHRIEK_2011.mp3",
  "/resources/soundsnap_woodblock_BPM_100_27_SHRIEK_2011.mp3",
  "/resources/soundsnap_woodblock_BPM_120_5_SHRIEK_2011.mp3",
  "/resources/soundsnap_woodblock_WOODBLUCK_BPM_120_3_MYEDIT.mp3"
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

      e.respondWith(fromNetwork(e.request.url, 2000).catch(function () {
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
