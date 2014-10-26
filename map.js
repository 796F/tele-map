var twilio = require('twilio');
var config = require('./config.js');
// com ed 
// Create a new REST API client to make authenticated requests against the
// twilio back end
var client = new twilio.RestClient(config.sid, config.token);
client.calls.create({ 
  to: "+18003347661", 
  from: "+13023973373",
  method: "GET",  
  fallbackMethod: "GET",  
  statusCallbackMethod: "GET",
  url: "http://ec2-54-84-89-6.compute-1.amazonaws.com/text.xml",
  record: "false" 
}, function(err, call) { 
  if(err) {
    console.log(err);
  }else{
    console.log(call); 
    debugger;  
  }
});

var restify = require('restify');

var server = restify.createServer({
    name : "tele-map"
});

server.use(restify.queryParser());  //parses the query string, ie /repo/three.js
server.use(restify.bodyParser());   //turns requests into js objects automagically
server.use(restify.CORS());         //configures 'Cross-origin resource sharing'
 
server.listen("8080", "0.0.0.0", function(){
    console.log('%s ws now listening on %s ', server.name , server.url);
});

server.get({ path : '/test' } , function (req, res, next) {
  console.log(req);
  debugger;
});

server.get({ path: '/.*'}, restify.serveStatic({
  directory: './public',
  default: 'index.html'
}));
