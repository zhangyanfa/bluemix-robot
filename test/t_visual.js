var fs = require('fs');
var resourceFile = fs.readFileSync("../properties.json","utf-8");
global.resource = JSON.parse(resourceFile);

var Translate = require('../modules/translate');
global.translate = new Translate(); 

var TTS = require('../modules/tts');
global.baiduTTS = new TTS();

var Visual = require('../modules/visual');

var visual = new Visual();

//visual.takePicture();

visual.classify();