var GrovePi = require('./libs').GrovePi

var SoundAnalogSensor = GrovePi.sensors.SoundAnalog

var soundSensor = new SoundAnalogSensor(2)

soundSensor.stream(1000, function(res) {
	console.log("Sound sensor = " + res);
	if (res > 2000) {
		console.log("Sound sensor > 2000 : " + res);
	}
});

