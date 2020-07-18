var alarm = 0
var timers = {}
var workers = {}
let Sound
let previewTimer

let lastSound = null

const defaultTimerValue = 'breathe in deeply'

const {log} = console;

if ('serviceWorker' in navigator){
            
        navigator.serviceWorker
        .register('sw.js')
        .then(function(reg){
            //console.log('sw registered', reg);
        })
  
} else {
    alert('serviceWorker not available in this browser');
}
  

document.addEventListener('DOMContentLoaded',function(ev){
  
    // var falcon = document.getElementById('falcon')
    // var woodblock = document.getElementById('woodblock_100_5')
    // let once = document.getElementById('once')
    
    if (!window.Worker){
        document.getElementById('interval').innerHTML = "NO WEB WORKER"
        return alert('web worker no available')
    }


    let timerAdd = document.getElementById('timerAdd')

    timerAdd.addEventListener('click', function(){

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context = new AudioContext();
        context.resume();


        toggleAddTimerButton('none')

        //let timerSettings = document.getElementById('newTimerSettings')
        Sound = document.querySelectorAll('audio')[1]

        let node = document.getElementById('newTimerSettings')

        // prevent button to open more than 1 timer
        if (node.innerHTML !== '') return;

            
        createTimerMenu.call(node,'test string')

        // inform user if he names Timer with name that was already used
        const nameInput = document.querySelector('#newTimerText')
        nameInput.removeEventListener('input', onTimerNameChange)
        nameInput.addEventListener('input', onTimerNameChange)


        // preview sound 
        document.getElementById('soundSelection').addEventListener('change',(ev)=>{
            lastSound = ev.srcElement.selectedOptions[0].value
            log('lastSound', lastSound)
                    Sound.pause()

                    let choice = ev.srcElement.selectedIndex + 1 // +1 bcs there is woodblock demo sound as 0th element 
                    console.log("choice index",choice, ev.srcElement.selectedOptions[0].value)

                    let demo = document.querySelectorAll('audio')//.children
                    Sound = demo[choice]
        })

        // form validation => adding new timer
        document.getElementById('confirmNewTimer').addEventListener('click', ()=>{
            let newMenu = document.getElementById('newTimerSettings')

            function abort(){
                alert('you have to:\n1)  provide some description and \n2)  set interval larger than 0');
                //newMenu.parentNode.removeChild(newMenu)
            }                    
            
            // set timer name
                const timerNumber = (Object.keys(window.timers).length + 1).toString()
                let timerName = document.getElementById('newTimerText').value || timerNumber || defaultTimerValue
                timerName = timerName.trim()

                if (timerName === '' ){
                    return alert('there has to be unique name of timer')
                }

                timerName = timerName.replace(/\s/g,"_")
                
            // check that this name isnt used already = prevent duplicities & bugs

                if (window.timers.hasOwnProperty(timerName)){
                    alert(`choose different timer name,\n"${timerName}" is already in your list`)
                    return
                }    

                    // set sound
                        let sounds = document.querySelectorAll('audio'),
                            index = document.getElementById('soundSelection').selectedIndex + 1
                        let Sound = sounds[index]
                        let myArgs = []
                            myArgs[0] = Sound
                        //console.log("Sound", Sound.getAttribute('id'), "\n")       // Array.isArray(myArgs)

                    // set interval number in minutes

                        let units = parseInt(document.querySelector('input[name="timeUnits"]:checked').value)
                        
                        let interval =  parseInt(document.getElementById('newTimerInterval').value) * units
                        if (isNaN(interval) || interval <= 0 ){
                                    alert('set proper interval')
                                    // set focus on that element
                                    return
                        }
                        document.getElementById('newTimerInterval').value = interval

                    // set repeats
                        let repeats = null
                        
                        if (document.getElementById('newTimerRepeats').value < 1 || isNaN(parseInt(document.getElementById('newTimerRepeats').value))
                        ) {
                            alert('repeats must be higher than 0')
                            // focus element
                            return
                        }
                        repeats = parseInt(document.getElementById('newTimerRepeats').value) || 1

                        
                      // set loud daytime
                        
                        /*let from = parseInt( document.getElementById('loudMin').value ) || 10
                        let till = parseInt( document.getElementById('loudMax').value ) || 23

                        if ( till <= from) {
                                alert('"From" must be earlier time than "To"')
                                return
                        }*/
                    

            // create interval 
                window.timers[timerName] = {}
                window.timers[timerName].name = timerName
                window.timers[timerName].active = true
                window.timers[timerName].soundName = Sound.getAttribute('id')
                window.timers[timerName].loud = true
                //window.timers[timerName].from = from
                //window.timers[timerName].till = till
                window.timers[timerName].units = (units===1)? " sec":" min"
                window.timers[timerName].interval = interval * 1000
                window.timers[timerName].repeats = repeats
                window.timers[timerName].remains = repeats
                window.timers[timerName].timer = myTimer.apply(window.timers[timerName], [myArgs])
                
                //console.log("new timer\n", window.timers[timerName])
                //newMenu.parentNode.removeChild(newMenu)   
                addTimerToList(window.timers[timerName])

                newMenu.innerHTML = '' 
                newMenu.style.display = 'none'
                toggleAddTimerButton('block')
        })
    })

    
})
function myTimer(args){
            //console.log("this", this)
            //console.log("args")
            //console.log(Array.isArray(args), args)

            let self = this, sound = args[0]
            // clone = Object.assign({}, self)
                // delete clone.sound
            
                //let myInterval = setInterval.bind(self)
                //console.log( myInterval)

            if (window.Worker){
                
                //let 
                workers[this.name] = {}

                workers[this.name].worker = new Worker('scripts/webworker.js')
        
                workers[this.name].worker.onmessage = function(e){
                        //console.log("timer name", e.data)
                        //console.log(e)
                        //if (e.data % 2===0) 
                        updateTimerInfo(e.data)
                        playSound( sound )
                        //alarm = 0
                }
                //console.log(this.worker)
                workers[this.name].worker.postMessage(self)        
            }



}

function updateTimerInfo(timer){


        //let el = document.getElementById(timer.name)
        let ch = document.getElementById(timer.name).childNodes
        let remains = getEl('remains')
        remains.innerHTML = 'remains: ' + timer.remains

        let status = getEl('status')
        if (timer.remains === 0) status.innerHTML = '<h3 class="timerStatus">finished</h3>'


        function getEl(classname){

                for (let i=0;i<ch.length; i++){
                        //console.log("child class", ch[i].getAttribute('class'))
                        if (ch[i].getAttribute('class').includes(classname)) return ch[i]
                }
        }
}

function addTimerToList(timer){

        if (document.getElementById('setTimersHeader').innerHTML == '')
                document.getElementById('setTimersHeader').innerHTML = 'your timers'

        const name = timer.name.toString()
        let div = document.createElement('div')
        div.setAttribute('class', 'timerLIExpanded') 

        div.id = name

        div.innerHTML = '<h5 class="reminder">' + name.replace(/_/g," ") + '</h5>' + 
                        '<p class="sound">sound: ' + timer.soundName + '</p>' + 
                        '<p class="interval">interval: ' + timer.interval/1000 + " " + timer.units + '</p>' + 
                        '<p class="remains">remains: ' + timer.remains + '</p>' // +
                        //'<p class="from"> from:' + timer.from + '</p>' + 
                        //'<p class="till"> till:' + timer.till + '</p>' 

        if (timer.active) div.innerHTML += '<p class="status">active</p>'
        else div.innerHTML += '<p class="status">switched off</p>'
        
        div.innerHTML += '<br/>'
        //div.innerHTML += `<div class="flex"></div>`
        //<button class="delete" onclick="deleteTimer(${timer.name})" data-id="${timer.name}">delete</button>
        const buttonContainer = document.createElement('DIV')
        buttonContainer.classList.add('flex')
        div.appendChild(buttonContainer)
        
        const deleteButton = document.createElement('BUTTON')
        deleteButton.innerHTML = 'delete'
        deleteButton.addEventListener('click', ()=>deleteTimer(timer.name) )

        buttonContainer.appendChild(deleteButton)
        // <button class="pause">pause</button>

        return document.getElementById('setTimers').appendChild(div)
}

function deleteTimer(timername){

    if (workers[timername].worker) workers[timername].worker.terminate()
    
    delete window.timers[timername]
    delete workers[timername]
    
    let el = document.getElementById(timername)
    el.parentNode.removeChild(el)

    if( document.getElementById('setTimers').innerHTML==='' ){ document.getElementById('setTimersHeader').innerHTML = ''}
}

function playSound(sound){
    return sound.play()
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

// function testTimer(){
        
//         let node = document.createElement('p')
//         node.innerHTML = 'timer set';
//         node.setAttribute('id', "announce")

//         document.getElementById('cons').appendChild(node)

//         setTimeout(function(){
//             let node = document.getElementById('announce')
//             node.innerHTML = 'timeout passed';
            
//             console.log('timer passed')
//             falcon.play();
            
//         },15000)
// }

// node.innerHTML = new timerMenu()
function createTimerMenu(node){

        this.setAttribute('style', 'display: flex;')

        this.innerHTML = `
            <div class="full flexBetween topMar15 paddingVert5">
                <div class="width35"></div>
                <h3>set new timer</h3>
                <h5 class="cancel" id="cancelAddTimer">✖</h5>
            </div>` +

                    // '<h5 class="cancel" id="cancelAddTimer">✖</h5>' + 
                    // '<h3>setting new timer</h3>' +

                    `<div id="nameContainer" class="full flexBetween marginTopX">
                        <h4>remind me</h4>
                        <input id="newTimerText" type="text" placeholder="breathe in deeply" autocomplete='off'>
                    </div>` +
                    '<br/>' +

                    '<div id="soundChoiceContainer" class="section full flex around border1pxBlack marginTopX">' + 
                        '<h4>sound</h4>'+
                         '<select id="soundSelection">'+
                              '<option value="soundsnap_MYEDIT_CRYSTAL_WAND_ON_SINGING_BOWL.mp3" '+
                                        '>bowl light</option>' + 
                              '<option value="soundsnap_MYEDIT_WINE_CORK_MALLET_DINGING_ON_SINGING_BOWL_LONG_HOLD.mp3" ' +
                                        '>bowl deep</option>' + 
                              '<option value="soundsnap_TIBETAN_BOWL_SINGING_MYEDIT.mp3" '+
                                        '>bowl gradual</option>' + 
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
                         '<button id="previewSound" class="smallBut" style="width: auto;">🔊</button>' +
                    '</div>' +
                    // '<br/>' +

                    //'<h4>repeats</h4>'+
                    '<div id="intervalContainer" class="full horiz around marginTopX border1pxBlack">' + 

                        '<div class="vert paddingBottom15">' +
                            //'<label >interval</label >' + 
                            
                           '<div id="intervalTop" class="full ">' +
                                '<h4 class="marginRightX">interval</h4>'+
                                '<input id="newTimerInterval" type="number" min="1" value="1">' +  
                                '<form id="timeUnits">' +
                                    `<div class="full">
                                        <input type="radio" name="timeUnits" value="1" checked >sec
                                    </div> 
                                    <div class="full">
                                        <input type="radio" name="timeUnits" value="60" class="">mins
                                    </div>` +
                                '</form>' +
                           '</div>' +

                           '<div class="full flexBetween" style="margin-top: 1em;">' + 
                              '<button class="smallBut hasNumericValue" value="20"  >20</button>' + 
                              '<button class="smallBut hasNumericValue" value="35"  >35</button>' + 
                              '<button class="smallBut hasNumericValue" value="50"  >50</button>' + 
                              '<button class="smallBut hasNumericValue" value="65"  >65</button>' + 
                              '<button class="smallBut hasNumericValue" value="80"  >80</button>' + 
                              '<button class="smallBut hasNumericValue" value="95"  >95</button>' + 
                           '</div>' + 
                        '</div>' +   

                        `<div id="buttonsAddRemove5" class="paddingBottom15">
                           <button id="add5" class="smallBut addRemove5 relativeDownMinus1" value="+5">+5</button>
                           <button id="remove5" class="smallBut addRemove5" value="-5">-5</button>
                        </div>` +

                        '<div class="vert paddingBottom15">' +
                            '<label id="repeatLabel">repeats</label >' +
                            //'<div id="repeatsNumber">' +
                                
                                '<input id="newTimerRepeats" type="number" min="1" value="1">' +

                                '<div class="horiz" style="margin-top: 1em;">' +
                                   '<button id="add1Repeat"    class="smallBut" >+</button>' + 
                                   '<button id="remove1Repeat" class="smallBut" >-</button>' + 
                                '</div>' +   
                           // '</div>' + 
                        
                         //   '<div class="horiz topMar15">' +
                         //       '<label >indefinite</label >' + 
                         //       '<input id="indefiniteRepeat" type="checkbox" disabled>' +
                         //   '</div>' +       
                        '</div>' +       
                    '</div>' + 


                         /*     '<div class="full horiz around botMar25" style="border: 1px solid">' + 
                         '<h4>sounds only</h4>'+
                         '<input id="loudMin" type="number" min="0" max="23" value="10">' +
                         '<span>till</span>' +
                         '<input id="loudMax" type="number" min="0" max="23" value="23">' +
                         '</div>' + */

                    '<button id="confirmNewTimer" class="marginTopX">set timer</button>' 

            // set last sound as selected
            const options = document.querySelectorAll('#soundSelection option')
            options.forEach( option =>{
                // log(option.value)

                if (option.value === lastSound) option.setAttribute('selected', '')
            })

        ;
        // cancelling new timer
        document.getElementById('cancelAddTimer').addEventListener('click',(ev)=>{
                document.getElementById('newTimerSettings').innerHTML = ''
                document.getElementById('newTimerSettings').style.display = 'none'
                toggleAddTimerButton('block')
        })
        // inifinite repeat change
        /*document.getElementById('indefiniteRepeat').addEventListener('change',(ev)=>{
                        console.log("checked?",ev.srcElement.checked)
                        let active = ev.srcElement.checked
                        if (active){
                                document.getElementById('newTimerRepeats').disabled = true;  
                                //document.getElementById('repeatsNumber').style.textDecoration = 'line-through'
                                document.getElementById('repeatLabel').style.color = 'gray'

                                
                        } else {
                                document.getElementById('newTimerRepeats').disabled = false;
                                //document.getElementById('repeatsNumber').style.textDecoration = 'none'
                                document.getElementById('repeatLabel').style.color = 'black'
                        }
        })*/
        document.querySelector('#previewSound').addEventListener('click', ev =>{
             
               let choice = document.querySelector('#soundSelection').selectedIndex + 1 // +1 bcs there is woodblock demo sound as 0th element 
               console.log("choice index",choice, document.querySelector('#soundSelection').selectedOptions[0].value)

               const previewSound = document.querySelectorAll('audio')[choice]
               previewSound.currentTime = 0

               //console.log(Sound === previewSound)

               if (previewTimer) clearTimeout(previewTimer)
               previewSound.play()
               previewTimer = setTimeout(()=>previewSound.pause(), 5000)
        })
        document.querySelectorAll('button.smallBut.hasNumericValue').forEach(el => {
            el.addEventListener('click', ev =>{
                document.querySelector('#newTimerInterval').value = ev.srcElement.value
            })
          })

        // +- repeats for new timer
        document.querySelector('#add1Repeat').addEventListener('click', ev =>
               document.querySelector('#newTimerRepeats').value++ 
        )
        document.querySelector('#remove1Repeat').addEventListener('click', ev =>{
            const el = document.querySelector('#newTimerRepeats')
            if (el.value === "1") return;
            el.value--
            
        })
        
        document.querySelectorAll('.addRemove5').forEach( button => {
            button.addEventListener('click', ev =>{
                const inputEl = document.querySelector('#newTimerInterval')
                const delta = parseInt(ev.srcElement.value)
                const currentValue = parseInt(inputEl.value || 1)

                if ( parseInt(currentValue) + delta < 1) return alert('cant have negative values')
                
                inputEl.value = currentValue + delta
            })
        })
        /*document.getElementById('soundSelection').addEventListener('change',()=>{
            let demo = document.querySelectorAll('audio').children
            console.log(demo);
        })

        document.getElementById('confirmNewTimer').addEventListener('click', ()=>{
            let soundHref = document.getElementById('soundSelection').selectedOptions[0].value
        })*/
}

function toggleAddTimerButton(type){
     const but = document.querySelector('#timerAdd')
     but.style.display = type
}

function onTimerNameChange(ev){
    const currentValue = ev.target.value.toString().trim()
    const workerName = currentValue.replace(/\s/g,"_")
    
    if ( window.timers[workerName] ) {
        log('exists')
        toggleTimerNameWarning(true)
        toggleAddTimerButtonDisabled( true )

    } else {
        log('green light')
        toggleTimerNameWarning(false)
        toggleAddTimerButtonDisabled( false )
    }
}

function toggleTimerNameWarning( warn ){

    const input = document.querySelector('#newTimerText')

    if (warn && input.classList.contains('warn') === false) input.classList.add('warn') 
    else if (warn === false) input.classList.remove('warn') 
}

function toggleAddTimerButtonDisabled( disabled ){
    const button = document.querySelector('#confirmNewTimer')

    if (disabled) button.setAttribute('disabled', '')
    else button.removeAttribute('disabled')
}