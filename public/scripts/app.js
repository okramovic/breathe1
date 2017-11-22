//alert('hi from script');


if ('serviceWorker' in navigator){
  
        //alert('browser has service worker');
        console.log('serviceWorker available');
          
        navigator.serviceWorker
            .register('sw.js')
            .then(function(reg){
          
              console.log('sw registered', reg);
        })
  
  }
  
  document.addEventListener('DOMContentLoaded',function(ev){
    
      console.log("ahoj\n" ,ev)
    
      let falcon = document.getElementById('falcon')
      
      let once = document.getElementById('once')
      
      once.addEventListener('click', function(){

            let node = document.createElement('p')
            node.innerHTML = 'falcon pressed';
            document.querySelector('body').appendChild(node)

            console.log('falcon play')
            //alert('falcon sound');
          falcon.play()
      })
    
  })
