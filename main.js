#!/usr/bin/env node

var TeleMap = require('./lib/TeleMap.js');
var PhoneNode = require('./lib/PhoneNode.js');

var mapper = new TeleMap();

var n1 = new PhoneNode();
n1.id = 1;
n1.number = "+14343211337";

var n2 = new PhoneNode();
n2.id = 2;
n2.number = "+14343211337";
n2.parent = n1;
n2.duration = 117;
n2.digit = 2;
n2.waitTime = ((117/3)/4) * 2;

// console.log(n1.getTWIML());
// console.log(n2.getTWIML());
mapper.makeCall(n1);
mapper.makeCall(n2);
