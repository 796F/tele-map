#!/usr/bin/env node

var twilio = require('twilio');
var config = require('./config.js');
var qs = require('querystring');
var client = new twilio.RestClient(config.sid, config.token);

client.calls.create({
  to: "+13023546447",
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
    console.log(call);
    console.log('CALL LOGGED ABOVE');
  }
});
