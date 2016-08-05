
/*#M0	停止动作
#M1	向前走
#M2	向后退
#M3	向右转身
#M4	向左转身
#M5	挥双手
#M6	挥右手
#M7	握双手
#M8	挥左手
#M9	伸出右手*/

function checkAction(actionName,text) {
	var ary = actionName.split("");

	for(i=0; i<ary.length; i++) {
		if( text.indexOf( ary[i] ) < 0 ) {
			return false;
		}
	}
	return true;
}

function playVoice(txt, duration) {
	if( !duration ) duration = 5000;

	baiduTTS.play_or_tts_ch(txt,function(){

		setTimeout(function(){
			serialport.write("M00\n");
		}, duration);

		setTimeout(function(){
				serialport.write("M-1\n");
				speaking = false;
				can_record=true;
				doing = false;
		}, duration+1000);
	});
}

Motion.prototype.doAction = function(text) {

	if( text == null || text == "" ) {
		
	} else if( checkAction("停", text) ) {
		serialport.write("M00\n");
	} else if( checkAction("向前走", text) ) {
		doing = true;
		serialport.write("M01\n");
		playVoice("遵命");
	} else if( checkAction("向后退", text) ) {
		doing = true;
		serialport.write("M02\n");
		playVoice("遵命");
	} else if( checkAction("右转身", text) || checkAction("又转身", text)) {
		doing = true;
		serialport.write("M04\n");
		playVoice("遵命");
	} else if( checkAction("左转身", text) || checkAction("昨转身", text) ) {
		doing = true;
		serialport.write("M03\n");
		playVoice("遵命");
	} else if( checkAction("灰双手", text) || checkAction("挥双手", text) || checkAction("挥动双手", text) ) { 
		doing = true;
		serialport.write("M05\n");
		playVoice("遵命");
	} else if( checkAction("灰右手", text) || checkAction("挥右手", text) || checkAction("挥动右手", text) ) { 
		doing = true;
		serialport.write("M06\n");
		playVoice("遵命");
	} else if( checkAction("握双手", text) ) { //text.indexOf("握双手") >=0
		doing = true;
		serialport.write("M07\n");
		playVoice("遵命");
	} else if( checkAction("挥左手", text) || checkAction("挥着手", text) ) {   //识别差
		doing = true;
		serialport.write("M08\n");
		playVoice("遵命");
	} else if( checkAction("伸出右手", text) ) {
		doing = true;
		serialport.write("M09\n");
		playVoice("遵命");
	} else if( checkAction("跳舞", text) ) {
		doing = true;
		serialport.write("M10\n");
		playVoice("遵命", 10000);
	} else if( checkAction("招呼", text) ) {
		var hello = "";
		var d = new Date();
		var h = d.getHours();
		if( h >= 6 && h < 12 ) {
			hello = "上午好！";
		} else if( h >= 12 && h < 14 ) {
			hello = "中午好！";
		} else if( h >= 14 && h < 18 ) {
			hello = "下午好！";
		} else if( h >= 18 ) {
			hello = "晚上好！";
		}
		doing = true;
		serialport.write("M05\n");
		playVoice("大家，" + hello);
	} else if( checkAction("开灯", text) ) {
		doing = true;
		baiduTTS.play_or_tts_ch("好的",function(){
			iot_client.publish('iot-2/evt/light_sensor/fmt/json', '{"d":{"light":"on"}}'); 
			setTimeout(function(){
				speaking = false;
				can_record=true;
				doing = false;
			}, 2000);
		});
	} else if( checkAction("关灯", text) ) {
		doing = true;
		baiduTTS.play_or_tts_ch("好的",function(){
			iot_client.publish('iot-2/evt/light_sensor/fmt/json', '{"d":{"light":"off"}}'); 
			setTimeout(function(){
				speaking = false;
				can_record=true;
				doing = false;
			}, 2000);
		});
	}

}

var actionTime = 1000;

function Motion() {
}

module.exports = Motion;