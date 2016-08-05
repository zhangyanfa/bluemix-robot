
var request = require('request');
var crypto = require('crypto');

var url = "http://api.fanyi.baidu.com/api/trans/vip/translate";
var appid = '20160603000022650';
var secretKey = 'CGaYSrUX8xlIso0zBDaf';

Translate.prototype.translate = function(text, from, to, callback) {

	if(!from) from = "en";
	if(!to) to = "zh";

	var salt = Math.round(Math.random() * Math.pow(10,10));

	var sign = crypto.createHash('md5').update(appid + text + salt + secretKey).digest('hex');

	request.post({url:url, 
		form: {q: text,
			from: from,
			to:to,
			appid:appid,
			salt:salt,
			sign:sign
		}}, 
		function(error,response,body){
			console.log(body);
			if (!error && response.statusCode == 200) {
				var bodyObj = JSON.parse(body)
				
				if( body && bodyObj.trans_result && bodyObj.trans_result.length > 0 && bodyObj.trans_result[0] ) {
					var txt = bodyObj.trans_result[0].dst
					console.log(txt);
					callback(txt);
				}

			} else {
				console.log("err:"+error);
			}
		}
	);
}


Translate.prototype.toZh = function(txt, callback) {
	this.translate(txt, "en", "zh", callback);

}

Translate.prototype.toEn = function(txt, callback) {
	this.translate(txt, "zh", "en", callback);
}

function Translate() {

}

module.exports = Translate;