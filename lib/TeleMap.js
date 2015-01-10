var restify = require('restify');
var config = require('../config.js');
var twilio = require('twilio');
var client = new twilio.RestClient(config.sid, config.token);
var qs = require('querystring');
var DataController = require('./DataController');

var PhoneNode = require('./PhoneNode.js');
var PhoneGraph = require('./PhoneGraph.js');

function TeleMap() {
  this.server;
  
  this.phoneGraph;
  this.dataController;
  this.activeRoutes = {};

  // this._initData();
  // this._initPhoneGraph();
  this._initServer();
}

TeleMap.prototype._initData = function() {
  this.dataController = new DataController();
}

TeleMap.prototype._initPhoneGraph = function () {
  var data = this.dataController.get();
  this.phoneGraph = new PhoneGraph(data);
}

TeleMap.prototype._initServer = function () {
  var self = this;
  self.server  = restify.createServer({ name : "tele-map" });
  self.server.use(restify.queryParser());  //parses the query string, ie /repo/three.js
  self.server.use(restify.bodyParser());   //turns requests into js objects automagically
  self.server.use(restify.CORS());         //configures 'Cross-origin resource sharing'

  self.server.listen("1337", "127.0.0.1", function(){
    console.log('%s ws now listening on %s ', self.server.name , self.server.url);
  });

  self.server.post({ path : '/transcript' } , self._handleTranscribeCallback);
  self.server.get({ path : '/test' } , function(req, res, next) {
    res.send(200, 'testing is good');
    next();
  });
}

TeleMap.prototype._handleTranscribeCallback = function (req, res, next) {
  //get the duration of the recording
  debugger;
  //get the numbers said in the transcript

  //set the digit

  //calculate the wait time for each child node

  //mark the parent as status done

  //create the children nodes 


  var response_obj = qs.parse(req.body);
  var regex = /([0-9#*])/g;
  var matches = response_obj.TranscriptionText.match(regex);
  
  client.recordings.list({ callSid : response_obj.CallSid }, function(err, data) {
    data.recordings.forEach(function(recording) {
      console.log(recording);
    });
  });
}

TeleMap.prototype._loadFirebaseData = function() {
  this.nodesRef.on("value", function(snapshot) {
    console.log(snapshot.val());
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  this.edgesRef.on("value"); 
  //
  //
  //
}

TeleMap.prototype.makeCall = function (node) {
  //make call using params, 

  //set the SID when the response comes

  this.activeRoutes[node.id] = this.server.get({ path : '/' + node.id }, this._generateXmlEndpoint(node));
  debugger;
  client.calls.create({
    to: node.number,
    from: "+13023973373",
    method: "GET",
    fallbackMethod: "GET",
    statusCallbackMethod: "GET",
    url: "http://maplio.tk/" + node.id,
    record: "false"
  }, function(err, call) { 
    if(err) {
      console.log(err);
    }else{
      node.sid = call.sid;
    }
  }.bind(node));
}

TeleMap.prototype._generateXmlEndpoint = function (node) {
  return function(req, res, next) {
    this.server.rm(this.activeRoutes[node.id]);
    this.activeRoutes[node.id] = undefined;

    res.setHeader('Content-Type','application/xml');  
    res.send(200, node.getTWIML());
    next();
  }.bind(this)
}

function _deadEndpointFunction(req, res, next) {
  res.send(200, 'DEAD END');
  next()
}

module.exports = TeleMap;
