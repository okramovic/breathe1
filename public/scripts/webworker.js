var i = 0
var timer
var self

onmessage = function(e){
        self = e.data
        console.log("__ worker received data __", self)
        
        //postMessage(i)// * e.data[0] * e.data[1])
          
        timer = setInterval(function(smt){
                //console.log("smt",self.remains)

                if (self.remains <= 0) { clearInterval(timer); 
                    
                    close()
                    return 
                }
                postMessage(self.name)
                self.remains --
                console.log("this")
                //console.log(this)

        }, self.interval * 5000)
      
      /*timer = setInterval(function(){
                  if (i >= 4) {
                    clearInterval(timer)
                    i = 0
                  } else { 
                      i++
                      postMessage(i)
                  }
      },4500)*/
}

// close()