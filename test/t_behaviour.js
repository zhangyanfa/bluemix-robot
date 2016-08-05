global.serialport = require('../modules/RapiroCmd');

var TTS = require('../modules/tts');
global.baiduTTS = new TTS();


var Behaviour = require('../modules/behaviour');
var behaviout = new Behaviour();

global.speaking = false;
global.can_record = true;
global.doing = false;
global.ultrasonicSuspend = false;



behaviout.doAction("挥动双手");