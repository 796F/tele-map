// a map, essentially a node controller

function PhoneGraph (root) {
  this.root = root;
}

PhoneGraph.prototype.setRoot = function(root) {
  this.root = root;
}

PhoneGraph.prototype.hasChild = function hasChild() {

}

PhoneGraph.prototype.getAliveLeaf = function() {
  //traverse tree for a node that hasn't been called

}

module.exports = PhoneGraph;
