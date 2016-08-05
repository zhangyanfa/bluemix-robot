var watson = require('watson-developer-cloud');
var cp = require('child_process');
var mic;
mic = cp.spawn('arecord', ['--device=plughw:1,0', '--format=S16_LE', '--rate=44100', '--channels=1']); //, '--duration=10'
mic.stderr.pipe(process.stderr);


STT.prototype.openStt = function() {

	var speech_to_text = watson.speech_to_text({
		username: '21740d35-2638-4686-8dc5-7f61ef0327d8',
		password: 'sRtsm2L1NdH4', 
		version: 'v1'
	});

	var params = {
		content_type: 'audio/wav',
		model:'zh-CN_BroadbandModel' ,
		continuous: true,
		inactivity_timeout: -1
	};

	//gled.write(1);

	// create the stream
	recognizeStream = speech_to_text.createRecognizeStream(params);
    mic.stdout.pipe(recognizeStream);
	
	// listen for 'data' events for just the final text
	// listen for 'results' events to get the raw JSON with interim results, timings, etc.

	recognizeStream.setEncoding('utf8'); // to get strings instead of Buffers from `data` events
	
	// listen for 'data' events for just the final text
	console.log("[stt.js - openStt] start record");
	recognizeStream.on('results',  function(data){

		console.log('[stt.js - openStt - record open]openStt: speaking:'+speaking + "==can_record:" + can_record);	

		if(data.results[0] && data.results[0].final && data.results[0].alternatives){
			if(speaking == false && can_record == true){
				console.log("[stt.js - recognizeStream]recording........................");
				//recording = true;
				ch_r = data.results[0].alternatives[0].transcript;
				ch_c = parseFloat(data.results[0].alternatives[0].confidence);
				ch_d = data;

				if( ch_r.indexOf("Human_noise") < 0 && ch_r != '谢谢' ) {
					console.log('[stt.js - recognizeStream]transcript: ' + ch_r);
					console.log('[stt.js - recognizeStream]confidence: ' + ch_c);
					//console.log('Results event confidence: ' + ch_d);

					bomb.emit('speak');
				}
			} else if(speaking==false) {
				console.log("switch on");
				//speaker_using=false;
				can_record=true;
				//gled.write(1);
			}
	    }
	});

  
  	recognizeStream.on('error',  function() {
	    console.log.bind(console, 'error event: ');
	});
 
    recognizeStream.on('connection-close',  function() {
	    console.log.bind(console, '==============connection-close event: ===========================');
	});

}


gled = null;


var ch_c = 0;
var ch_r = "no";
var ch_d = 0;

function STT() {
}

STT.prototype.getCh_c = function() {
	return ch_c
}
STT.prototype.getCh_r = function() {
	return ch_r
}

STT.prototype.getCh_d = function() {
	return ch_d
}


module.exports = STT;

