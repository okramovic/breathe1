//alert('hi from script');


if ('serviceWorker' in navigator){
  
        //alert('browser has service worker');
    
        navigator.serviceWorker
            .register('./sw.js')
            .then(function(reg){
          
              console.log('sw registered', reg);
        })
  
  }
  
  document.addEventListener('DOMContentLoaded',function(ev){
    
      console.log("ahoj\n" ,ev)
    
      let falcon = document.getElementById('falcon')
      
      let once = document.getElementById('once')
      
      once.addEventListener('click', function(){
          console.log('falcon play')
          alert('falcon sound');
          falcon.play()
      })
    
  })