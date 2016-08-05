
var http = require('http');
var https = require('https');
var fs = require('fs');
var process = require('child_process');
const spawn = process.spawn;
const crypto = require('crypto');

var Aplay = require('node-aplay');
var Sound = require('./node-mplayer');

var baiduToken = null;
var baiduCuid = '60-67-20-39-32-DC'

function getToken() {
	var baiduApiKey = '72ZLyNsGUp6SRWkyDaz2XehX'
	var baiduSecretKey = '9fa473c1113193fff6e5e93b7b6ac1de'
	var params = 'grant_type=client_credentials&client_id='+baiduApiKey+'&client_secret='+baiduSecretKey;
	var options = {
				host: 'openapi.baidu.com',
				port: 80,
				path: '/oauth/2.0/token?' + params,
				method: 'GET',
				headers:{
				}
			 };
	var req = http.request(options, function (res) {
		console.log('Create Voice STATUS: ' + res.statusCode);
		
		res.on('data',function (chunk) {
			 //console.log(""+chunk);
			 var json = JSON.parse(""+chunk);
			 baiduToken = json.access_token;
			 console.log("[tts.js - getToken]"+baiduToken);
		});
		
		res.on('end',function () {
		});
	});
			
	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	req.end();
}

getToken();


//baiduToken = '24.de9b2e41eeb3bc55483bbe0c3003649f.2592000.1465615360.282335-7660754';
//module.exports.Text2Speech = function(text) {
TTS.prototype.toSpeech = function(text, hash, spd, callback){
	if( spd == null ) {
		spd = 5;
	}
	const tts = spawn('python', ['/projects/robot/py/dialogPlayer.py', '--file', hash, '--txt', text, '--spd', spd, '--token', baiduToken]);

	tts.stdout.on('data', (data) => {
		console.log('Create Voice:' + data);
		callback();
	});

}


TTS.prototype.play_or_tts_ch = function(text,callback){
	console.log("[tts.js - play_or_tts_ch - text]:"+text);

	var hash = crypto.createHash('md5').update(text).digest('hex');

	//	console.log(hash);
	var wav_file = '/home/pi/voice/tts_ch/' + hash;

	if(fs.existsSync(wav_file  + ".wav" )) {
		console.log("[tts.js - play_or_tts_ch]exists wav:"+wav_file + ".wav");
		play_and_block_mic(wav_file + ".wav", callback);
	} else if(fs.existsSync(wav_file + ".mp3")) {
		console.log("[tts.js - play_or_tts_ch]exists mp3:"+wav_file + ".mp3");
		play_and_block_mic(wav_file + ".mp3", callback);
	} else{
		this.toSpeech(text, hash, 5, function() {
			play_and_block_mic(wav_file + ".mp3", callback);
     	});
	}
}

var play_and_block_mic = function(wav_file, callback){
	console.log("[tts.js - play_and_block_mic]speaking:" + speaking + "==can_record:" + can_record);
	
	if(speaking==false){
		speaking = true;
		can_record = false;
		console.log('[tts.js - play_and_block_mic]' + wav_file);
	
		if( wav_file != null && wav_file != '' && wav_file.indexOf('.mp3') > 0 ) {
			this.processing_music = new Sound(wav_file);
		} else {
			this.processing_music = new Aplay(wav_file);
		}
		this.processing_music.play();
				
		this.processing_music.process.on('exit',function(){
			console.log("[tts.js - play_and_block_mic]finish");

			if(callback){
				console.log('execute callback');
				callback();
			} else {
				speaking = false;
				can_record=true;
			}
		});
	}
}

TTS.prototype.processing_music = null;

function TTS() {
}

module.exports = TTS;

/*can_speak : false,
can_record : true

var test = new TTS();

test.play_or_tts_ch('');*/



/*function toSpeech2(text, hash, spd, callback){
	
	var params = 'cuid=' + baiduCuid + '&tok=' + baiduToken + '&ctp=1&lan=zh' + '&tex=' + encodeURI(text) + '&spd=' + spd;
	var options = {
		host: 'tsn.baidu.com',
		port: 80,
		path: '/text2audio?' + params,
		method: 'GET',
		headers:{
		}
	};
	var voiceFile = '/home/pi/voice/tts_ch/'+hash+'.mp3';
	var postData = http.request(options, function (res) {
		console.log('Create Voice STATUS: ' + res.statusCode);
		
		// res.on('data',function (chunk) {
		// 	var file = fs.createWriteStream(voiceFile);
		// 	file.write(chunk, function() {
		// 	});
		// });

		res.on('data',function (chunk) {
			fs.writeFileSync(voiceFile, chunk);
		});
		
		res.on('end',function () {
			
		});

	});
	
	postData.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	postData.end();

}*/