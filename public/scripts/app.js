//alert('hi from script');


if ('serviceWorker' in navigator){
  
        //alert('browser has service worker');
        console.log('serviceWorker available');
          
        navigator.serviceWorker
            .register('sw.js')
            .then(function(reg){
          
              console.log('sw registered', reg);
        })
  
} else {
    alert('serviceWorker not available in this browser');
}
  
  document.addEventListener('DOMContentLoaded',function(ev){
    
      console.log("DOM loaded" ,ev)
    
      var falcon = document.getElementById('falcon')
      
      let once = document.getElementById('once')
      
      once.addEventListener('click', function(){

            let node = document.createElement('p')
            node.innerHTML = 'falcon pressed';
            document.querySelector('body').appendChild(node)

            console.log('falcon play')
            //alert('falcon sound');
            falcon.play()
      })
    
      let timer = document.getElementById('timer')

      timer.addEventListener('click', testTimer)

  })

function testTimer(){
        //console.log(falcon)
        

        let node = document.createElement('p')
        node.innerHTML = 'timer set';
        node.setAttribute('id', "announce")

        document.getElementById('cons').appendChild(node)

        setTimeout(function(){
            let node = document.getElementById('announce')
            node.innerHTML = 'timeout passed';
            
            console.log('timer passed')
            falcon.play();
            
        },15000)
}
