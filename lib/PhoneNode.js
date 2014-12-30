function PhoneNode() {
  this.children = [];
  this.parent;
  this.sid;
  this.number;
  this.digit;
  this.done = false;
}

PhoneNode.prototype.getTWIML = function() {
  var output = '<?xml version="1.0" encoding="UTF-8"?>' +
               '<Response>' +
                '<Play digits="' + this.getExtension() + '"></Play>' +
                '<Record maxLength="120" ' +
                  'transcribe="true" ' +
                  'transcribeCallback="' + this.getCallbackUrl() + '"' +
                  'timeout="120" />' +
               '</Response>';
  return output;
}

PhoneNode.prototype.getCallbackUrl = function () {
  return 'http://ec2-54-84-89-6.compute-1.amazonaws.com/test';
}

PhoneNode.prototype.getExtension = function () {
  if(!this.parent) 
    return '';
  else
    return 'ww' + this.digit + this.parent.getExtension();
}


PhoneNode.prototype.setDigit = function(digit) {
  this.digit = digit;
}

PhoneNode.prototype.addChild = function(child) {
  this.children.push(child);
}
