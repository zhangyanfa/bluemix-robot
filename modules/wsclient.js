var cp = require('child_process');
var mic;
mic = cp.spawn('arecord', ['--device=plughw:1,0', '--format=S16_LE', '--rate=44100', '--channels=1']); //, '--duration=10'
mic.stderr.pipe(process.stderr);

var W3CWebSocket = require('websocket').w3cwebsocket;
 
var client = new W3CWebSocket('ws://192.168.31.204:6002/stt');
 
client.onerror = function() {
    console.log('Connection Error');
};
 
client.onopen = function() {
    console.log('WebSocket Client Connected');
 
    function sendNumber() {
        if (client.readyState === client.OPEN) {
            //var number = Math.round(Math.random() * 0xFFFFFF);
            //client.send(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    //sendNumber();

    //client.send("test ws");

    //mic.stdout.pipe(client);
    mic.stdout.on('data',function(chunk){

        
        //if( chunk.length > 23336 ) {

            console.log('send %d bytes', chunk.length);

            client.send(chunk);
        //}
        
    })
};
 
client.onclose = function() {
    console.log('echo-protocol Client Closed');
};
 
client.onmessage = function(e) {
    if (typeof e.data === 'string') {
        console.log("Received: '" + e.data + "'");
    }
};

