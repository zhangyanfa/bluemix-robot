
var request = require('request');
var fs = require('fs');
var uuid = require('uuid');
var process = require('child_process');
const spawn = process.spawn;

Visual.prototype.takePicture = function(callback) {
    var image_file = '/home/pi/pictures/' + uuid.v1() + '.jpg';

    var raspistill = spawn('raspistill', ['-vf', '-w','1024','-h','768', '-o', image_file]);

    raspistill.stdout.on('data', (data) => {
        console.log('[visual.js - takePicture] Create picture');
    });

    raspistill.stderr.on('data', (data) => {
        console.log('stderr: ${data}');
    });

    raspistill.on('close', (code) => {
        console.log('[visual.js - takePicture] Create picture finish');

        if( callback ) callback(image_file);
        
    });
    return image_file;
}

Visual.prototype.classify = function() {
    var bTime = Date.now();
    console.log("[visual.js - classify] begin_time:" + bTime);
    //var image_file = "/home/pi/pictures/dog1.jpg";
    this.takePicture( function(image_file) {
        request.post({
            url:url_classify, 
            formData: {images_file : fs.createReadStream(image_file)}
        }, 
        function(error,response,body){
            //console.log(httpResponse);
            //console.log(body);
            console.log('[visual.js - classify]body:'+body);
            if (!error && response.statusCode == 200 && body.indexOf('"status": "ERROR"') < 0) {
            
                if( body.indexOf('"class": "person"') > 0) {
                    //detectFacesFile(image_file);
                } else {
                    keywords(body, function(txt) {
                        console.log("[visual.js - classify] keywords:"+txt);
                        baiduTTS.play_or_tts_ch(txt,function(){
                                setTimeout(function(){
                                    speaking = false;
                                    can_record=true;
                                    ultrasonicSuspend = false;
                                }, 3000);
                        });
                    });
                }
            } else {
                console.log("[visual.js - classify]err:"+error);
                speaking = false;
                can_record=true;
                ultrasonicSuspend = false;
            }
            var eTime = Date.now();
            console.log("[visual.js - classify] end_time:" + Date.now());
            console.log("[visual.js - classify] elapsed_time:" + (Date.now() - bTime)/1000 + "s");
        });
    });
}

Visual.prototype.detectFaces = function() {
    takePicture(function(image_file) {
        detectFacesFile(image_file);
    })
}

var detectFacesFile = function(image_file) {
    var bTime = Date.now();
    console.log("[visual.js - detectFacesFile] begin_time:" + bTime);
    //image_file = "/home/pi/pictures/zhangyuqi1.jpg";

    request.post({
        url:url_detect_faces, 
        formData: {images_file : fs.createReadStream(image_file)}
    }, 
    function(error,response,body){
        //console.log(httpResponse);
        //console.log(body);
        if (!error && response.statusCode == 200 && body.indexOf('"status": "ERROR"') < 0) {
            console.log('[visual.js - detectFacesFile]body:'+body);
            keywords(body, function(txt) {
                console.log("[visual.js - classify] keywords:"+txt);

                        baiduTTS.play_or_tts_ch(txt,function(){
                                setTimeout(function(){
                                    speaking = false;
                                    can_record=true;
                                    ultrasonicSuspend = false;
                                }, 3000);
                        });
            });
        } else {
            console.log("[visual.js - detectFacesFile]err:"+error);
            speaking = false;
            can_record=true;
            ultrasonicSuspend = false;
        }
        var eTime = Date.now();
        console.log("[visual.js - detectFacesFile] end_time:" + Date.now());
        console.log("[visual.js - detectFacesFile] elapsed_time:" + (Date.now() - bTime)/1000 + "s");
    });

}



function keywords(body, callback) {

    if(body == null || body == '') {
        return;
    }

    var result = JSON.parse(body);

    if( result.status == "ERROR" ) {
        console.log("[visual.js - keywords] status:"+result.status);
        return;
    }

    if( body.indexOf('"faces"') > 0 ) {
        
        var str = '';
        var faces = result.images[0].faces;

        for(var i=0; i<faces.length; i++) {
            var face = faces[i];

            str += "Ages " + face.age.max + " to " + face.age.min + "; gender " + face.gender.gender + "; identity " + face.identity.name;
        }

        console.log("[visual.js - keywords]faces" + str);

        if( str ){
            str = "This is a "+str;
            translate.toZh(str, callback);
        }
    } else if( body.indexOf('"classifiers"') > 0 ){
        var str = '';
        var classes = result.images[0].classifiers[0].classes;

        for(var i=0; i<classes.length; i++) {
            if( i > 0) str += ',';
            str += classes[i].class;
        }

        console.log("[visual.js - keywords]classifiers" + str);

        if( str ) {
            str = "This is a "+str;
            translate.toZh(str, callback);
        }
    }

}

function Visual() {
    apikey = resource.visual_recognition.apikey;
    url_classify = 'https://gateway-a.watsonplatform.net/visual-recognition/api/v3/classify?api_key='+apikey+'&version=2016-05-20';
    url_detect_faces = 'https://gateway-a.watsonplatform.net/visual-recognition/api/v3/detect_faces?api_key='+apikey+'&version=2016-05-20';
}

module.exports = Visual;

var url_classify = null;
var url_detect_faces = null;
var apikey = null;

