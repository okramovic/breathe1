const shellName = "breathe_v01",
origin = "https://breathe1.herokuapp.com"
shellFiles = [
  "/index.html",
  "/styles/style.css",
  "/styles/lake1.jpg",
  "/scripts/app.js",
  "/scripts/webworker.js",
  "/resources/falcon.mp3",
  "/resources/soundsnap_woodblock_BPM_100_5_SHRIEK_2011.mp3"
]

self.addEventListener('install', function(e) {
      console.log('[ServiceWorker] Install');

      e.waitUntil(
            caches.open(shellName).then(function(cache) {
                  console.log('[ServiceWorker] installation: Caching app shell');

                  return cache.addAll(shellFiles);
            })
      );
});



self.addEventListener('activate', function(e) {

      console.log('sw activated');
})


// offline serving
self.addEventListener('fetch', function(e) {

      console.log('[ServiceWorker] Fetch for ', e.request.url,"\n",e.request)

      // try to get new version from network
      if (isShellFile()){
          console.log("it is app shell req")

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
                                        console.log(response)
                                return response ||  fetch(e.request)
                              })
                    );
                }
          }).catch(e=>{
              console.error(e);
                //throw e
          })
          // add new files to cache?
          /*e.waitUntil(
            caches.open(shellName).then(function(cache) {
                  console.log('[ServiceWorker] Caching app shell');

                  return cache.addAll(shellFiles);
            })
          );*/
      }

      //else { // get files from cache
             //console.log()
      function useCache(e){

            return  e.respondWith(
          
                    caches.match(e.request).then(function(response) {
                              console.log(response)
                        return response || fetch(e.request)
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
