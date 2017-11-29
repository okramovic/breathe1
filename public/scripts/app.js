//import { clearInterval } from "timers";

//alert('hi from script');
var alarm = 0
var timers = {}


if ('serviceWorker' in navigator){
  
        //alert('browser has service worker');
        //console.log('serviceWorker available');
          
        navigator.serviceWorker
            .register('sw.js')
            .then(function(reg){
          
                    console.log('sw registered', reg);
        })
  
} else {
    alert('serviceWorker not available in this browser');
}
  

document.addEventListener('DOMContentLoaded',function(ev){
    
      // console.log("DOM loaded" ,ev)
    
      var falcon = document.getElementById('falcon')
      var woodblock = document.getElementById('woodblock_100_5')
      let once = document.getElementById('once')
      
      let timerAdd = document.getElementById('timerAdd')

      timerAdd.addEventListener('click', function(){

                let userTimers = document.getElementById('userTimers')
                var Sound = null

                let node = document.createElement('div')
                    node.id = "newTimerSettings"
                    node.style= "background-color: rgba(24, 58, 153, 0.2);"
                createTimerMenu.call(node,'maminka')

                userTimers.appendChild(node)

                document.getElementById('soundSelection').addEventListener('change',(ev)=>{
                            console.log(ev)

                            let choice = ev.srcElement.selectedIndex + 1 // +1 bcs there is woodblock demo sound as 0th element 
                            console.log("choice index",choice, ev.srcElement.selectedOptions[0].value)

                            let demo = document.querySelectorAll('audio')//.children
                            Sound = demo[choice]
                            Sound.play()

                            /*let arr = nodesToArr.call(demo,demo.length)
                                //console.log(arr, Array.isArray(arr));

                                // contains mp3 file names
                                arr = arr.map((item)=>{ 
                                                let origin = item.children[0].baseURI
                                                let relPath = item.children[0].src.replace(origin + "resources/", "")
                                                return relPath})

                                //console.log(arr, Array.isArray(arr));

                                let xxx = arr.find((item)=>{ return item === choice })
                            // aim: play sound*/

                })

                document.getElementById('confirmNewTimer').addEventListener('click', ()=>{
                            let newMenu = document.getElementById('newTimerSettings')

                            function abort(){
                                        alert('you have to:\n1)  provide some description and \n2)  set interval larger than 0');
                                        newMenu.parentNode.removeChild(newMenu)
                            }

                            // check if maximum amount of timer hasnt been reached
                                    let props = 0
                                    for (var prop in window.timers){
                                            console.log("prop", prop)
                                            if (prop) props ++
                                    }
                                    if (props > 3){
                                        alert('you have too many timers set, 3 is max')
                                        let newMenu = document.getElementById('newTimerSettings')
                                        newMenu.parentNode.removeChild(newMenu)
                                        return
                                    }
                                    console.log('props', props)
                            // let soundHref = document.getElementById('soundSelection').selectedOptions[0].value
                            // set timer name
                                let timerName = document.getElementById('newTimerText').value
                                if (!timerName || timerName.trim()===""){   abort()
                                                                            return
                                }
                                timerName = timerName.replace(/\s/g,"_")

                            // set interval number
                                let interval =  parseFloat(document.getElementById('newTimerInterval').value)
                                if (isNaN(interval) || interval <= 0 ){
                                            abort()
                                            return
                                }
                                console.log("interval",interval, typeof interval)

                            // set repeats
                                let repeats = parseInt(document.getElementById('newTimerRepeats').value) || 5
                                console.log("repeats", repeats)


                            //
                            // set sound
                                let sounds = document.querySelectorAll('audio'),
                                    index = document.getElementById('soundSelection').selectedIndex + 1
                                let Sound = sounds[index]
                                let myArgs = []
                                    myArgs[0] = Sound
                                console.log("Sound", Sound, "\n", Array.isArray(myArgs), myArgs)

                            // create interval 
                                window.timers[timerName] = {}
                                window.timers[timerName].name = timerName
                                //setInterval(function(){},)
                                window.timers[timerName].interval = interval
                                window.timers[timerName].repeats = repeats
                                window.timers[timerName].remains = repeats
                                //window.timers[timerName].sound = Sound
                                window.timers[timerName].endDate = getEndDate()
                                window.timers[timerName].timer = myTimer.apply(window.timers[timerName], [myArgs])

                                newMenu.parentNode.removeChild(newMenu)    
                            // add this timer to active timers div    
                })
      })

      /*once.addEventListener('click', function(){

            let node = document.createElement('p')
            node.innerHTML = 'falcon pressed';
            document.querySelector('body').appendChild(node)

            console.log('falcon play')
            //alert('falcon sound');
            falcon.play()
      })*/
    

      /*let timer = document.getElementById('timer')
      timer.addEventListener('click', testTimer)*/

      if (window.Worker){
        /*window.worker = new Worker('scripts/webworker.js')

        window.worker.onmessage = function(e){
                console.log("received result from Worker", e.data)
                console.log(e)
                //if (e.data % 2===0) 
                woodblock.play()
                //alarm = 0
        }*/
        

        //console.log("web worker")
        //console.log(window.worker)

        //let interval = document.getElementById('interval')
        //interval.addEventListener('click', setMyInterval)

       } else {
        document.getElementById('interval').innerHTML = "NO WEB WORKER"
        alert('web worker no available')
      }
  })
function myTimer(args){
            console.log("this", this)
            console.log("args")
            console.log(Array.isArray(args), args)

            let self = this, sound = args[0]
            // clone = Object.assign({}, self)
                // delete clone.sound
            
                //let myInterval = setInterval.bind(self)
                //console.log( myInterval)

            if (window.Worker){
                //this.
                let worker = new Worker('scripts/webworker.js')
        
                worker.onmessage = function(e){
                        console.log("msg from Worker", e.data)
                        console.log(e)
                        //if (e.data % 2===0) 
                        sound.play()
                        //alarm = 0
                }
                //console.log(this.worker)
                worker.postMessage(self)        
            }



}

function setMyInterval(){
    //if (woodblock) woodblock.play()
    
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

// node.innerHTML = new timerMenu()
function createTimerMenu(node){

        //console.log(node)

        console.log(this)
        this.setAttribute('style', 'display: flex; flex-direction: column; align-items: center')

        this.innerHTML = 
                    '<label>what you want to be reminded of:</label>' +
                    '<input id="newTimerText" type="text" value="test" placeholder="sit with my back straight">' +
                    '<br/>' +

                    '<label>choose sound</label>'+
                    '<select id="soundSelection">'+
                        '<option value="mynoise_korimako_new_zealand_1.mp3" ' +
                                '>korimako</option>' + 
                        '<option value="mynoise_birds_random_palmgarden.mp3" ' +
                                '>garden</option>' + 
                        '<option value="mynoise_birds_coockoo.mp3" ' +
                                '>cuckoo</option>' + 
                        '<option value="mynoise_frogs_crickets_ricefield_mycookie.mp3" ' +
                                '>crickets</option>' + 
                        '<option value="soundsnap_bird_MYEDIT_LESSER_SHORT_TOED_LARK_SONG_KAZ_200502.mp3" '+
                                '>lark</option>' + 
                        '<option value="soundsnap_caxixi_BPM_130_12_SHRIEK_2011.mp3"'+
                                '>caxixi</option>' + 
                        '<option value="soundsnap_MODEM_DIAL_LOGON_AND_CONNECT_2_MYEDIT.mp3" ' +
                                '>modem</option>' + 
                        '<option value="soundsnap_fax_11507101_receiving.mp3" '+
                                '>fax</option>' + 
                        '<option value="soundsnap_MYEDIT_CRYSTAL_WAND_ON_SINGING_BOWL.mp3" '+
                                '>bowl light</option>' + 
                        '<option value="soundsnap_MYEDIT_WINE_CORK_MALLET_DINGING_ON_SINGING_BOWL_LONG_HOLD.mp3" ' +
                                '>bowl deep</option>' + 
                        '<option value="soundsnap_TIBETAN_BOWL_SINGING_MYEDIT.mp3" '+
                                '>bowl gradual</option>' + 
                        '<option value="soundsnap_woodblock_BPM_100_5_SHRIEK_2011.mp3" '+
                                '>woodblock cool</option>' + 
                        '<option value="soundsnap_woodblock_BPM_100_9_SHRIEK_2011_MYEDIT.mp3" '+
                                '>woodblock simple</option>' + 
                        '<option value="soundsnap_woodblock_BPM_100_18_SHRIEK_2011.mp3" '+
                                '>woodblock thoughtful</option>' + 
                        '<option value="soundsnap_woodblock_BPM_100_26_SHRIEK_2011.mp3" '+
                                '>woodblock master-plan</option>' + 
                        '<option value="soundsnap_woodblock_BPM_100_27_SHRIEK_2011.mp3" '+
                                '>woodblock rascal</option>' + 
                        '<option value="soundsnap_woodblock_BPM_120_5_SHRIEK_2011.mp3" '+
                                '>woodblock chinese</option>' + 
                        '<option value="soundsnap_woodblock_WOODBLUCK_BPM_120_3_MYEDIT.mp3" '+
                                '>woodblock intermezzo</option>' + 
                    '</select>' + 

                    '<br/>' +
                    '<label >interval (minutes)</label >' + 
                    '<input id="newTimerInterval" type="number" value="1">' +
                    '<br/>' +

                    '<label>how many times its repeated</label>' +
                    '<label>it ends after 5 repeats</label>' + 
                    '<input id="newTimerRepeats" type="number" disabled>' +
                    '<br/>' + '<br/>' +
                    '<button id="confirmNewTimer">set timer</button>' 

        ;
        
        /*document.getElementById('soundSelection').addEventListener('change',()=>{
                    let demo = document.querySelectorAll('audio').children

                    console.log(demo);
            })

            document.getElementById('confirmNewTimer').addEventListener('click', ()=>{

                let soundHref = document.getElementById('soundSelection').selectedOptions[0].value

        })*/
}

function getEndDate(){



}
/*function nodesToArr(len){

        let result = [];
        // i=1 to skip first woodblock audio

        for (var i=1; i<len; i++){

            result.push(this[i])
        }
        return result
}*/