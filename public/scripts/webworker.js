//import { clearInterval } from "timers";

//import { setTimeout } from "timers";

var i = 0
var timer

onmessage = function(e){
      
      console.log(i, "__ worker received data __", e.data)
      /*setTimeout(function(){
          postMessage(i)// * e.data[0] * e.data[1])
          
      }, 5000)*/
      
      timer = setInterval(function(){
                  if (i >= 4) {
                    clearInterval(timer)
                    i = 0
                  } else { 
                      i++
                      postMessage(i)
                  }
      },5000)
}

// close()