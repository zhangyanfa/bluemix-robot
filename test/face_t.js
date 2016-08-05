global.serialport = require('../modules/RapiroCmd');
var face = require('../modules/face');



face.thinking();

setTimeout(function(){
	face.thinkOut();
},10000);