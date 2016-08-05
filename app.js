

global.serialport = require('./modules/RapiroCmd');

//global.face = require('./modules/face');

var EventEmitter = require('events').EventEmitter;
global.bomb = new EventEmitter();
bomb.setMaxListeners(0);
var mip=new EventEmitter();
mip.setMaxListeners(0);

 //EventEmitter.setMaxListeners(EventEmitter.getMaxListeners() + 1);

var cp = require('child_process');
var request = require('request');
var fs = require('fs');
var path = require('path');

/** MQTT client configuration **/
var Client = require("ibmiotf").IotfDevice;
var mqtt = require('mqtt');
global.iot_client;

var resourceFile = fs.readFileSync("./properties.json","utf-8");
global.resource = JSON.parse(resourceFile);

global.speaking = false;
global.can_record = true;
global.doing = false;
global.ultrasonicSuspend = false;

var TTS = require('./modules/tts');
global.baiduTTS = new TTS();

var STT = require('./modules/stt');
var watsonStt = new STT();

var Motion = require('./modules/motion');
var motion = new Motion();

var Sensors = require('./modules/sensor');
sensors = new Sensors();

var Dialog = require('./modules/dialog');
var dialog = new Dialog();
dialog.conver('', function(res) {});

var Visual = require('./modules/visual');
global.visual = new Visual();

//var Translation = require('./modules/translation');
//global.translation = new Translation(); 

var Translate = require('./modules/translate');
global.translate = new Translate(); 

var NodeMcu = require('./modules/nodemcu');
global.nodeMcu = new NodeMcu();

var IoT = require('./modules/iot');

var tw=0;

var en_c=0;
var ch_c=0;
var en_r="no";
var ch_r="no";
var en_d=0;
var ch_d=0;
var trigger=false;
var board


/*bomb.on("thinking", function() {
	console.log("thinking");
	face.thinking();
});*/
bomb.on('speak',function(){

	console.log("bomb send event start==watsonStt.ch_c:"+watsonStt.getCh_c()+"==");

	console.log("bomb stt:"+watsonStt.getCh_r());

	//iot_client.publish('iot-2/evt/voicecmd_ch/fmt/json', JSON.stringify(watsonStt.getCh_d(), null, 2));

	motion.doAction( watsonStt.getCh_r() );

	if( doing == false) {
		dialog.conver(watsonStt.getCh_r(), function(converText) {
			//console.log("=====converText====" + converText);
			baiduTTS.play_or_tts_ch(converText,function(){
				speaking = false;
				can_record=true;

			});
		});
	}

});

// Connect rapiro to bluemix iotf
var clientId = ['d', resource.iot.org, resource.iot.device_type, resource.iot.device_id].join(':');
var iotConnParam = {"clientId" : clientId, "keepalive" : 30, "username" : "use-token-auth", "password" : resource.iot.token};
iot_client = mqtt.connect(resource.iot.mqtt_url, iotConnParam);
iot_client.on('connect', function() {
    console.log('[app.js - deviceClient] Rapiro client connected to IBM IoT Platform.');
    
    iot_client.publish('iot-2/evt/status/fmt/json', '{"d":{"status": "connected" }}'); //iot-2/evt/color/fmt/json

	baiduTTS.play_or_tts_ch('你好，我是钢豆', function () {
			setTimeout(function(){
				//console.log('iot_client: speaker_using:'+speaker_using + "==can_record:" + can_record);
				speaking = false;
				can_record = true;
				watsonStt.openStt();
			},1000);

			// start GrovePi sensor listening
	});
	sensors.start();
});

iot_client.subscribe('iot-2/cmd/+/fmt/+', function(err, granted){
    console.log('subscribed command, granted: '+ JSON.stringify(granted));
});

/*var config = {
	"org" : resource.iot.org,
	"id" : resource.iot.device_id,
	"type" : resource.iot.device_type,
	"auth-method" : "token",
	"auth-token" : resource.iot.token
};

global.deviceClient = new Client(config);
deviceClient.connect();
deviceClient.on("connect", function () {
	console.log('[app.js - deviceClient] Rapiro client connected to IBM IoT Platform.');
	//deviceClient.publish("BMP_TSL","json",'{ "d" : '+ JSON.stringify(data) + ' }');
	//你好，我是铁蛋
	baiduTTS.play_or_tts_ch('你好，我是小白', function () {
			setTimeout(function(){
				//console.log('iot_client: speaker_using:'+speaker_using + "==can_record:" + can_record);
				watsonStt.openStt();
			},1000);

			speaking = false;
			can_record=true;

			// start GrovePi sensor listening
			sensors.start(iot_client, baiduTTS, mip);
	});
});*/

// catches ctrl+c event
//sp.on("open", function() {
//    console.log('serial port opened');
//});

//iot_client.setMaxListeners(0);