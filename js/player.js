// player
var playList = ["philip_glass_duet.mp3", "ost2.mp3", "ost3.mp3"];
var bgList = ["piano.jpg", "bg2.png", "music_bg.jpg"]
var nameList = ["philip glass - duet", "Emily Wells - Becomes the Color", "Clint Mansell - A Family Affair"]
var $audio = document.querySelector('#demo');
var $bg = document.querySelector("#bg-image");
var $song = document.querySelector("#song");

var playId = 0;
var bgId = 0;
var nameId = 0;
document.getElementById("play").onclick = function() { 
  $audio.play();
  $song.innerHTML=nameList[0];
}

document.getElementById("pause").onclick = function() { 
  document.getElementById('demo').pause();
}
document.getElementById("next").onclick = function() { 
  if(playId >= playList.length) playId = 0;
  $audio.pause();
  $audio.setAttribute("src", "./audio/" + playList[playId]);
  $audio.load();
  if(bgId >= bgList.length ) bgId = 0;
  $bg.setAttribute("src", "./img/" + bgList[bgId]);
  if(nameId >= nameList.length ) nameId = 0;
  $song.innerHTML=nameList[nameId];
  playId++;
  bgId++;
  nameId++;
  
}



