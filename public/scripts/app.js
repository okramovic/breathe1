//alert('hi from script');
var alarm = 0

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
      var woodblock = document.getElementById('woodblock')
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

      if (window.Worker){
        window.worker = new Worker('scripts/webworker.js')

        window.worker.onmessage = function(e){
                console.log("received result from Worker", e.data)
                console.log(e)
                //if (e.data % 2===0) 
                woodblock.play()
                //alarm = 0
        }
        

        console.log("web worker")
        console.log(window.worker)

        let interval = document.getElementById('interval')
        interval.addEventListener('click', setMyInterval)

      } else {
        document.getElementById('interval').innerHTML = "NO WEB WORKER"
        alert('web worker no available')
      }
  })
function setMyInterval(){
    if (alarm === 0){
        //alarm = 1
        window.worker.postMessage([2,3])

    } else {
        //alarm = 0

    }

}

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
