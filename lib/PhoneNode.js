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

PhoneNode.prototype.getCallbackUrl = function () {
  return 'http://maplio.tk/transcript';
}

PhoneNode.prototype.setDigits = function(digits) {
  this.digits = digits;
}

PhoneNode.prototype.isRoot = function() {
  return !this.digits;
}

PhoneNode.prototype.isReady = function() {
  return this.status === 'ready';
}

PhoneNode.prototype.isCalling = function() {
  return this.status === 'calling';
}

PhoneNode.prototype.isDone = function() {
  return this.status === 'done';
}

PhoneNode.prototype.markDone = function(){
  this.status = 'done';
}

PhoneNode.prototype.markCalling = function(){
  this.status = 'calling';
}

module.exports = PhoneNode;
