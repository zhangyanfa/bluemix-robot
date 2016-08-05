var net = require('net');  
var process = require('process');

//var HOST = '192.168.31.117';  
var HOST = '192.168.8.102';
var PORT = 80;

//console.log(JSON.stringify(process.argv));

var argv = process.argv;
var client = new net.Socket();
  
// 为客户端添加“data”事件处理函数  
// data是服务器发回的数据  
client.on('data', function(data) {  
    console.log('DATA: ' + data);
    // 完全关闭连接
    client.destroy();
});
  
// 为客户端添加“close”事件处理函数  
client.on('close', function() {  
    console.log('Connection closed');  
});

NodeMcu.prototype.powerOn = function() {
	client.connect(PORT, HOST, function() {
    	console.log('CONNECTED TO: ' + HOST + ':' + PORT);    
	});
	client.write("on");
}

NodeMcu.prototype.powerOff = function() {
	client.connect(PORT, HOST, function() {
    	console.log('CONNECTED TO: ' + HOST + ':' + PORT);    
	});
	client.write("off");
}

function NodeMcu() {
	/*client.connect(PORT, HOST, function() {
    	console.log('CONNECTED TO: ' + HOST + ':' + PORT);    
	});*/
}

module.exports = NodeMcu;