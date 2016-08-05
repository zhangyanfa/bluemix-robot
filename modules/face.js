
module.exports.thinking = function() {
	
	if( !isThinking ) {
		isThinking = true;
	} else {
		return;
	}

	console.log("[face.js - thinking] begin...... ");
	serialport.write("PR255G000B000T005");
	color = "r";
	thinkId = setInterval(function() {
		if( color != "r" && color == "b") {
			serialport.write("PR255G000B000T005");
			color = "r";
		} else if( color != "g" && color == "r") {
			serialport.write("PR000G255B000T005");
			color = "g";
		} else if( color != "b" && color == "g") {
			serialport.write("PR000G000B255T005");
			color = "b";
		}
	}, 1000);

}

module.exports.thinkOut = function() {
	clearInterval(thinkId);
	serialport.write("PR000G000B255T005");
	color = "b";
	serialport.write("M-1");
	isThinking = false;
}

var color = "b";
var thinkId;
var isThinking = false;