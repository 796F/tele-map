var twilio = require('twilio');
var config = require('./config.js');
var qs = require('querystring');

// Create a new REST API client to make authenticated requests against the
// twilio back end
var client = new twilio.RestClient(config.sid, config.token);
client.calls.create({ 
  to: "+18003347661",
  from: "+13023973373",
  method: "GET",  
  fallbackMethod: "GET",  
  statusCallbackMethod: "GET",
  url: "http://ec2-54-84-89-6.compute-1.amazonaws.com/test.xml",
  record: "false" 
}, function(err, call) { 
  if(err) {
    console.log(err);
  }else{
    // console.log(call);
    console.log('CALL LOGGED ABOVE');
  }
});

var restify = require('restify');

var server = restify.createServer({
    name : "tele-map"
});

server.use(restify.queryParser());  //parses the query string, ie /repo/three.js
server.use(restify.bodyParser());   //turns requests into js objects automagically
server.use(restify.CORS());         //configures 'Cross-origin resource sharing'
 
server.listen("8080", "127.0.0.1", function(){
    console.log('%s ws now listening on %s ', server.name , server.url);
});

server.post({ path : '/test' } , function (req, res, next) {
  var response_obj = qs.parse(req.body);
  var regex = /([^0-9]+[0-9])/g;
  var matches = response_obj.TranscriptionText.match(regex);
  console.log(matches);
});

server.get({ path: '/.*'}, restify.serveStatic({
  directory: './public',
  default: 'index.html'
}));
