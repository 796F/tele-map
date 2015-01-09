var firebase = require('firebase');

function DataController() {

  this.rootRef;
  this.nodesRef;
  this.edgesRef;

  this._initFirebase();
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
