var restify = require('restify');
var config = require('./config.js');
var twilio = require('twilio');
var client = new twilio.RestClient(config.sid, config.token);
var qs = require('querystring');

var PhoneNode = require('./lib/PhoneNode.js');
var PhoneMap = require('./lib/PhoneMap.js');

function TeleMap() {
  this.server;

}

TeleMap.prototype.init = function () {
  var self = this;
  self.server  = restify.createServer({ name : "tele-map" });
  self.server.use(restify.queryParser());  //parses the query string, ie /repo/three.js
  self.server.use(restify.bodyParser());   //turns requests into js objects automagically
  self.server.use(restify.CORS());         //configures 'Cross-origin resource sharing'

  self.server.listen("1337", "127.0.0.1", function(){
    console.log('%s ws now listening on %s ', server.name , server.url);
  });

  server.post({ path : '/transcribeCB' } , self._handleTranscribeCallback);
  server.get({ path : '/getTWIML' }, self._handleGetTWIML);
}

TeleMap.prototype._handleTranscribeCallback = function (req, res, next) {
  var response_obj = qs.parse(req.body);
  var regex = /([0-9#*])/g;
  var matches = response_obj.TranscriptionText.match(regex);
  console.log(matches);
}

TeleMap.prototype._handleGetTWIML = function (req, res, next) {
  res.setHeader('Content-Type','application/xml');  
  res.send(200, output);
  next();
}

TeleMap.prototype.call = function (node) {
  client.calls.create({
    to: "+14343211337",
    from: "+13023973373",
    method: "GET",
    fallbackMethod: "GET",
    statusCallbackMethod: "GET",
    url: "https://dl.dropboxusercontent.com/u/34001284/test.xml",
    record: "false"
  }, function(err, call) { 
    if(err) {
      console.log(err);
    }else{
      console.log(JSON.stringify(call));
    }
  });
}
