


IoT.prototype.onMessage = function() {
	iot_client.on("message", function(topic,payload){
		console.log('received topic:'+topic+', payload:'+payload);
		if( topic == 'iot-2/cmd/robot_behavior/fmt/string' ) {
			//if( payload.action_code == '')
			doing = true;
			serialport.write(payload+"\n");
			tts.play_or_tts_ch("遵命",function(){
				setTimeout(function(){
					serialport.write("M00\n");
					speaking = false;
					can_record=true;
					doing = false;
				}, 3550);
			});
		} else if( topic == 'iot-2/cmd/manual_voice/fmt/string' ) {
			
			//serialport.write(payload+"\n");

			console.log('[IoT - onMessage] manual_voice-payload:' + payload);

			dialog.conver(payload+"", function(converText) {
				//console.log("=====converText====" + converText);
				tts.play_or_tts_ch(converText,function(){
					speaking = false;
					can_record=true;
				});
			});
		} else if( topic == 'iot-2/cmd/manual_action/fmt/string' ) {
			
			//serialport.write(payload+"\n");

			doing = true;
			serialport.write(payload+"\n");
			tts.play_or_tts_ch("遵命",function(){
				setTimeout(function(){
					serialport.write("M00\n");
					speaking = false;
					can_record=true;
					doing = false;
				}, 3550);
			});
		}

	});
}



var iot_client = null;
var tts = null;
var stt = null;
var dialog = null;
function IoT(client, _tts, _stt, _dialog) {
	iot_client = client;
	tts = _tts;
	stt = _stt;
	dialog = _dialog
}

module.exports = IoT;

