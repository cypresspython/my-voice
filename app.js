(function(){var texts={yes:'Yes, please.',no:'No, thank you.',love:'I love you, always.',food:'Food, please.',drink:'Drink, please.',bathroom:'I need to go to the bathroom.',hurt:'I hurt.',help:'I need help, please.',head:'My head hurts.',stomach:'My stomach hurts.',body:'My body hurts.',arm:'My arm hurts.',leg:'My leg hurts.',back:'My back hurts.',elsewhere:'I hurt somewhere else.',unsure:'I do not know where it hurts.',little:'It hurts a little.',lot:'It hurts a lot.'};var spoken=document.getElementById('spoken'),status=document.getElementById('status'),repeat=document.getElementById('repeat'),last=null,active=null,current=null,requestId=0;
var clips={};
Object.keys(texts).forEach(function(key){
  var clip=new Audio(key+'.mp3');
  clip.preload='auto';
  clips[key]=clip;
  clip.addEventListener('ended',function(){if(current===clip&&active){active.classList.remove('playing');active=null;}});
  clip.addEventListener('error',function(){if(current===clip){status.textContent='Audio unavailable. Check installation.';}});
});
function speak(key,button){
  var clip=clips[key];
  if(!clip)return;
  var id=++requestId;
  if(current){current.pause();try{current.currentTime=0;}catch(e){}}
  if(active)active.classList.remove('playing');
  active=button||null;
  if(active)active.classList.add('playing');
  last=key;repeat.disabled=false;spoken.textContent=texts[key];
  current=clip;
  try{clip.currentTime=0;}catch(e){}
  var result=clip.play();
  if(result&&result.catch)result.catch(function(){if(id===requestId){status.textContent='Tap again to play audio';if(active)active.classList.remove('playing');}});
}
var buttons=document.querySelectorAll('[data-say]');for(var i=0;i<buttons.length;i++){buttons[i].addEventListener('click',function(){speak(this.getAttribute('data-say'),this);});}document.getElementById('painButton').addEventListener('click',function(){speak('hurt',this);document.getElementById('home').hidden=true;document.getElementById('pain').hidden=false;window.scrollTo(0,0);});document.getElementById('goBack').addEventListener('click',function(){document.getElementById('pain').hidden=true;document.getElementById('home').hidden=false;window.scrollTo(0,0);});repeat.addEventListener('click',function(){if(last)speak(last,null);});if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')){navigator.serviceWorker.register('sw.js').then(function(){status.textContent='Offline files being prepared';navigator.serviceWorker.ready.then(function(){status.textContent='Offline files prepared — test in airplane mode';});}).catch(function(){status.textContent='Online mode — check offline setup';});}else{status.textContent='Preview mode — offline setup needs HTTPS';}})();
