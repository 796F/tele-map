var firebase = require('firebase');

function DataController() {

  this.rootRef;
  this.nodesRef;
  this.edgesRef;

  this._initFirebase();
}

DataController.prototype.get = function get() {
  // var data = this.dataController.get();
  var n1 = new PhoneNode();
  n1.id = 1;
  n1.number = "+14343211337";

  var n2 = new PhoneNode();
  n2.id = 2;
  n2.number = "+14343211337";
  n2.duration = 117;
  n2.digit = 2;
  n2.waitTime = ((117/3)/4) * 2;

  return [n1, n2];
}

DataController.prototype._initFirebase = function () {
  this.rootRef = new firebase("https://telemap.firebaseio.com/");
  this.nodesRef = this.rootRef.child('nodes');
  this.edgesRef = this.rootRef.child('edges');
}

DataController.prototype.addNode = function (node) {
  this.nodesRef.child(node.sid).set(node);
}

DataController.prototype.addEdge = function (edge) {
  this.edgesRef.push(edge);
}

DataController.prototype.updateNode = function (node) {

}

module.exports = DataController;
