
var http = require('http');
var fs = require('fs');

Dialog.prototype.conver = function(text, callback) {

	can_record = false;
	console.log("conversation_id:" + this.conversation_id + "===client_id:" + this.client_id+ "===dialog_id:" + this.dialog_id);

	if( text != null && text != '' ) {
		text = text.replace(/[',', '.', '?', ' ', '，', '。', '？']/g,"");

		var txtAry = text.split("");
		var newTxt = "";
		for(var i=0; i<txtAry.length; i++) {
			if( i > 0) {
				newTxt += ' ';
			}
			newTxt += txtAry[i];
		}
	}

	

	var params = '';
	if( this.conversation_id != null && this.conversation_id != '' && this.client_id != null && this.client_id != '' ) {
		params = 'conversation_id='+this.conversation_id+'&client_id='+this.client_id+'&input=' + encodeURI(newTxt);
	}

	var options = {
		//host: '172.20.27.155',
		host: 'rapiro-nodejs.mybluemix.net',
		port: 80,
		path: '/conversation?' + params,
		method: 'GET',
		headers:{
		}
	};

	var req = http.request(options, function (res) {
		console.log('conversation STATUS: ' + res.statusCode);
		
		res.on('data',function (chunk) {
			console.log( chunk.toString() );

			var results = JSON.parse(chunk.toString());

			Dialog.prototype.dialog_id = results.dialog_id;
			Dialog.prototype.conversation_id = results.conversation.conversation_id;
			Dialog.prototype.client_id = results.conversation.client_id;
			Dialog.prototype.response = results.conversation.response;
			//console.log("results == conversation_id:" + this.conversation_id + "===client_id:" + this.client_id);
		});

		res.on('end',function () {
			// console.log();
			callback(Dialog.prototype.response[0]);
		});

	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});
	req.end();

}

Dialog.prototype.conversation_id = '';
Dialog.prototype.client_id = '';
Dialog.prototype.dialog_id = '';


function Dialog() {

}

module.exports = Dialog;


