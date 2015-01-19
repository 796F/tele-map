function PhoneNode(options) {
  this.id = options.id;
  this.sid = options.sid;
  this.number = options.number;
  this.parentSid = options.parentSid;
  this.toneString = options.toneString
  this.status = 'ready';
}

PhoneNode.prototype.getTWIML = function() {
  var output =  '<?xml version="1.0" encoding="UTF-8" ?>' +
                '<Response>' +
                (this.isRoot() ? '' : '<Play digits="' + this.toneString + '"></Play>') +
                '<Record maxLength="120" ' +
                    'transcribe="true" ' +
                    'transcribeCallback="' + this.getCallbackUrl() + '" ' +
                    'timeout="120"/>' +
                '</Response>';
  return output;
}

PhoneNode.prototype.getCallbackUrl = function getCallbackUrl() {
  return 'http://maplio.tk/transcript';
}

PhoneNode.prototype.getTWIMLPath = function getTWIMLPath() {
  return '/' + this.id;
}

PhoneNode.prototype.setDigits = function setDigits(digits) {
  this.digits = digits;
}

PhoneNode.prototype.isRoot = function isRoot() {
  return !this.digits;
}

PhoneNode.prototype.isReady = function isReady() {
  return this.status === 'ready';
}

PhoneNode.prototype.isCalling = function isCalling() {
  return this.status === 'calling';
}

PhoneNode.prototype.isDone = function isDone() {
  return this.status === 'done';
}

PhoneNode.prototype.markDone = function markDone(){
  this.status = 'done';
}

PhoneNode.prototype.markCalling = function markCalling(){
  this.status = 'calling';
}

module.exports = PhoneNode;
