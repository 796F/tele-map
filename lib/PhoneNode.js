function PhoneNode() {
  this.id;
  this.children = [];
  this.parent;
  this.sid;
  this.number;
  this.digit;
  this.waitTime;
  this.status = 'waiting';
}

PhoneNode.prototype.getTWIML = function() {
  var output =  '<?xml version="1.0" encoding="UTF-8"?>' +
                '<Response>' +
                (this.isRoot() ? '' : '<Play digits="' + this.getExtension() + '"></Play>') +
                '<Record maxLength="120" ' +
                    'transcribe="true" ' +
                    'transcribeCallback="' + this.getCallbackUrl() + '" ' +
                    'timeout="120"/>' +
                '</Response>';
  return output;
}

PhoneNode.prototype.getCallbackUrl = function () {
  return 'http://ec2-54-84-89-6.compute-1.amazonaws.com/transcribedData';
}

PhoneNode.prototype.getExtension = function () {
  if(!this.parent) 
    return '';
  else
    return this.getWaitTimeInW() + this.digit + this.parent.getExtension();
}

PhoneNode.prototype.getWaitTimeInW = function() {
  var waitingW = '';
  for(var i=0; i<this.waitTime * 2; i++) {
    waitingW += 'w'
  }
  return waitingW;
}

PhoneNode.prototype.setDigit = function(digit) {
  this.digit = digit;
}

PhoneNode.prototype.isRoot = function() {
  return !this.digit;
}

PhoneNode.prototype.addChild = function(child) {
  this.children.push(child);
}

PhoneNode.prototype.isWaiting = function() {
  return this.status === 'waiting';
}

PhoneNode.prototype.isReady = function() {
  return this.status === 'ready';
}

PhoneNode.prototype.isDone = function() {
  return this.status === 'done';
}

PhoneNode.prototype.setStatus = function(status){
  this.status = status;
}

PhoneNode.prototype.getUnprocessedChildren = function() {
  var results = [];
  for(var i=0; i<this.children.length; i++) {
    results.push()
  }
  return false;
}

module.exports = PhoneNode;
