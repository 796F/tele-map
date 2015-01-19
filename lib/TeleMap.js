var restify        = require('restify');
var config         = require('../config');
var twilio         = require('twilio');
var qs             = require('querystring');
var _              = require('underscore');

var DataController = require('./DataController');
var PhoneNode      = require('./PhoneNode');
  
function Mapper() {
  this.server;
  this.twilio;
  this.dataController;

  this.nextNodeId = 0;
  this.waiting = [];  //array since we just need to queue
  this.calling = {};  //map because we need to do lookup by SID
  this.done = [];
  this.errors = [];

  this.activeRoutes = {};

  this._initTwilio();
  this._initData();
  this._initServer();
}

Mapper.prototype.run = function run () {
  var testNode = this._createRootNode("+14343211337");
  this.waiting.push(testNode);
  setInterval(function() {
    //every 2 seconds pop a node and call it if possible.
    if(this.waiting.length > 0) {
      this.mapNode(this.waiting.pop());  
    }
  }.bind(this), 2000);
}

Mapper.prototype._createRootNode = function _createRootNode(number) {
  return new PhoneNode({
    id : this.nextNodeId++,
    number : number
  });
}

Mapper.prototype._createChildNode = function _createChildNode(parentNode, childToneString) {
  return new PhoneNode({ 
    id : this.nextNodeId++,
    parentSid : parentNode.sid,
    number : parentNode.number,
    toneString : parentNode.toneString + childToneString
  });
}


Mapper.prototype._initData = function _initData() {
  this.dataController = new DataController();
}

Mapper.prototype._initTwilio = function _initTwilio() {
   this.twilio = new twilio.RestClient(config.sid, config.token);
}

Mapper.prototype._initServer = function () {
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
  self.server.get({ path : '/debug' } , function(req, res, next) {
    res.send(200, 'debugging ...');
    next();
    debugger;
  });
}

Mapper.prototype.mapNode = function (node) {
  var callOptions = {
    to: node.number,
    from: config.twilioNumber,
    method: "GET",
    fallbackMethod: "GET",
    statusCallbackMethod: "GET",
    url: "http://maplio.tk" + node.getTWIMLPath(),
    record: "false"
  };
  
  this.activeRoutes[node.id] = this.server.get({ path : node.getTWIMLPath() }, this._generateXmlEndpoint(node));
  this.twilio.calls.create(callOptions, this._generateCallMadeHandler(node, this));
}

Mapper.prototype._generateCallMadeHandler = function(node, mapper) { 
  //when calls are made, twilio calls back with call info or error
  return function(err, call) {
    if(err) {
      node.error = err;
      this.errors.push(node);
    }else{
      //set the SID when the response comes
      node.sid = call.sid;
      node.markCalling();
      this.calling[node.sid] = node;
    }
  }.bind(mapper);
}

Mapper.prototype._handleTranscribeCallback = function (req, res, next) {
  var response_obj = qs.parse(req.body);
  var regex = /([0-9#*])/g;
  var numberMatches = _.uniq(response_obj.TranscriptionText.match(regex)); //unique number matches
  var currentSid = response_obj.CallSid;

  this.twilio.recordings.list({ callSid : currentSid }, this._generateRecordingHandler(numberMatches, currentSid));
}

Mapper.prototype._generateRecordingHandler = function (numberMatches, currentSid) {
  return function(err, data) {
    var recording = data.recordings[0];  //assume only 1 recording for now.  
    if(recording) {
      var waitChunk = recording.duration / numberMatches.length;  //ex.  120 duration, first number waits 120/length
      //for each number in the transcript  
      for(var i=0; i<numberMatches.length; i++) {
        var waitTime = waitChunk * (i + 1);
        var childToneString = _getWaitTimeInW(waitTime) + numberMatches[i];
        var parentNode = this.calling[currentSid];
        var child = this._createChildNode(parentNode, childToneString);
        this.waiting.push(child);
        
        this.calling[currentSid] = undefined;
        this.done[currentSid] = parentNode;
      }
    }
  }
}

Mapper.prototype._generateXmlEndpoint = function (node) {
  return function(req, res, next) {
    this.server.rm(this.activeRoutes[node.id]);
    this.activeRoutes[node.id] = undefined;

    res.writeHead(200, { 'Content-Type': 'application/xml' });
    res.write(node.getTWIML());
    res.end();
  }.bind(this)
}

_getWaitTimeInW = function(seconds) {
  var waitingW = '';
  for(var i=0; i<seconds * 2; i++) {
    waitingW += 'w'
  }
  return waitingW;
}

module.exports = Mapper;


/*

creation of a node manually, forget loading nodes, or automated stuff.  

node created manually in ready state

node starts with 
  this.id;
  this.number;
  this.status = 'ready';

  and if 2nd level or above in the graph, 

  this.toneString
  this.parentSid; //parent

ready node is used to generate an endpoint which spits out twiML 
ready node is used to make a call using the endpoint, marking node as calling,
  callback sets the node's SID


transcribe callback comes, with the SID.  
  parse the transcript and find the other digits.
    if digits do not repeat, then mark the node for human review.
    multiple recordings per call?
  use the SID and get the recording's length, 

  see how many times digits were repeated, divid total recordings by that number.  
  for each digit,
    get prev node using the SID
    use the prev node's number, id, as the base
    new nodes parentSID should be old SID
    new node this.toneString is old node string plus something gneerated from recording duration, digits

*/
