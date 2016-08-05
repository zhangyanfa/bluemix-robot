var GrovePi = require('../libs').GrovePi
var Commands = GrovePi.commands
var Board = GrovePi.board

var UltrasonicDigitalSensor = GrovePi.sensors.UltrasonicDigital
var LightAnalogSensor = GrovePi.sensors.LightAnalog
var SoundAnalogSensor = GrovePi.sensors.SoundAnalog
var ButtonDigitalSensor = GrovePi.sensors.ButtonDigital
//var BuzzerDigitalSensor = GrovePi.sensors.BuzzerDigital
var DigitalSensor = require('../libs/sensors/base/digitalSensor')

var ultrasonicSensor
//var dhtSensor
var lightSensor
var soundSensor
//var buzzerSensor
var loudSensor
//start();

var ultrasonicWaiting = false;
var lightWaiting = false;
var lightPower = 0;

var usCount = 0;
Sensors.prototype.start = function() {
	console.log('[sensor.js - start]GrovePi sensor starting');

	board = new Board({
    	debug: true,
    	onError: function(err) {
      		console.log("[sensor.js - onInit]" + err);
    	},
    	onInit: function(res) {
    		if (res) {
    			// Digital Port 3
        		ultrasonicSensor = new UltrasonicDigitalSensor(2)
        		// Digital Port 7
				buttonSensor = new ButtonDigitalSensor(7)

        		// Analog Port 1
        		lightSensor = new LightAnalogSensor(1)
        		// Analog Port 2
	 			//soundSensor = new SoundAnalogSensor(2)
	
				buttonSensor.stream(100,function(res){
					//console.log("按钮="+res);
					if(res==1){
						console.log("[groveSensor.js - buttonSensor] reset");
						if( baiduTTS.processing_music ) baiduTTS.processing_music.stop();
						trigger=false;
						speaking=false;
						can_record=true;
						doing = false;
		 				//serialport.write("M00\n");
					}
				});

        		ultrasonicSensor.stream(1000, function(res) {
        			//console.log('[sensor.js - ultrasonicSensor]超音波='+ res);
					if(res && res !=0 && ultrasonicSuspend == false){
						if(res>3&&res<7) {
							
							console.log('take picture');
							//serialport.write("M01\n");
							ultrasonicSuspend = true;
							visual.classify();
						}else if(res<3 && speaking == false && can_record == true) {
							//console.log('move back');
							ultrasonicSuspend = true;
							
							serialport.write("M05\n");
							
							baiduTTS.play_or_tts_ch('你靠我太近了，请跟我保持距离。',function(){
								setTimeout(function(){
									serialport.write("M00\n");
									speaking = false;
									can_record=true;
									ultrasonicSuspend = false;
								}, 3000);
								setTimeout(function(){
									serialport.write("M-1\n");
									speaking = false;
									can_record=true;
									ultrasonicSuspend = false;
								}, 4500);
							});
						}
						//iot_client.publish('iot-2/evt/u_sensor/fmt/json', '{"d":{"ultrasonic": '+res+' }}'); //iot-2/evt/light/fmt/json
					}
		 		});


				lightSensor.stream(2000, function(res) {
        			//console.log('[sensor.js - lightSensor]Light Stram value=' + res)
					
					//deviceClient.publish("light_sensor","json", '{"d":{"light": '+res+' }}');
					if(res>150 && speaking == false && can_record == true) {
						//controlLight("on");
						if ( lightPower == 0 && lightWaiting == false ) {
							iot_client.publish('iot-2/evt/light_sensor/fmt/json', '{"d":{"light":"on"}}'); 
							lightWaiting = true;
							baiduTTS.play_or_tts_ch("天黑了，我把电灯打开吧。",function(){
								//nodeMcu.powerOn();
								lightPower = 1;
								setTimeout(function(){
									//serialport.write("M00\n");
									speaking = false;
									can_record=true;
									lightWaiting = false;
								}, 2000);
							});
						}
					} else {
						if ( lightPower == 1 && lightWaiting == false ) {
							iot_client.publish('iot-2/evt/light_sensor/fmt/json', '{"d":{"light":"off"}}'); 
							lightWaiting =true;
							baiduTTS.play_or_tts_ch("天亮了，我要把电灯关了。",function(){
								//nodeMcu.powerOff();
								lightPower = 0;
								setTimeout(function(){
									//serialport.write("M00\n");
									speaking = false;
									can_record=true;
									lightWaiting = false;
								}, 2000);
							});
						}
					}

        		});

        		/*soundSensor.stream(1000,function(res){
					//console.log("sound sensor= " +res);
			 		if(res>2000) {
						serialport.write('M05\n');
				 		play_or_tts_ch("別再吹了，我有點癢",function(){
							serialport.write('M00\n');
							speaking = false;
							can_record=true;
				 		});
			 		}
			 		//iot_client.publish('iot-2/evt/sound_sensor/fmt/json', '{"d":{"sound": '+res+' }}'); //iot-2/evt/light/fmt/json
				});*/
		
	
				//gled = new DigitalSensor(6)

        		console.log('GrovePi Version :: ' + board.version())
  
       		} else {
        		console.log('[sensors.js] no res ')
      		}
    	}
	})
  	board.init();
}

function Sensors() {

}

module.exports = Sensors;

//var sensors = new Sensors();
//sensors.start();