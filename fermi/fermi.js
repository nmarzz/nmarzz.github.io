var context;
var nodeID = 0;
var alienID = 0;
var alienSpeed = 0.001 * window.innerWidth; // expressed as a fraction of the screen width
var alienColors = ["#FF8C00","#DC143C","#9932CC","#00BFFF","#4B0082"];
class Node {
  constructor(x,y) {this.x = x; this.y = y; this.explored = false; this.explored_by = -1; this.id = nodeID++}
}
class Edge{
  constructor(Node1,Node2) {this.Node1 = Node1 ; this.Node2 = Node2}
}
class Graph{
  constructor(width, height, num_nodes) {
  this.num_nodes = num_nodes
  this.width = width
  this.height = height
  this.Nodes = this.getNodes()
  this.Edges = []
  }

  getNodes(){
    var Nodes = []
    for (var j=0;j<this.num_nodes;j++){
      var x = Math.floor(Math.random() * this.width)
      var y = Math.floor(Math.random() * this.height)

      // console.log(x)
      var newNode = new Node(x,y)
      Nodes.push(newNode)
      }
    return Nodes
  }
  getDistances() {
    var Nodes = this.Nodes
    var distMatrix = []
    var i,j,n1, n2, dist

    for (i in Nodes) {
      var distances = []
      n1 = Nodes[i]
      for (j in Nodes){

        n2 = Nodes[j]
        if (i == j|n2.explored) {dist = Infinity} else {dist = Math.sqrt((n1.x - n2.x)**2 + (n1.y - n2.y)**2)}

        distances.push(dist)
      }
      distMatrix.push(distances)
    }
    return distMatrix
  }

}

class Alien{
  constructor(graph){
  this.id = alienID++
  this.graph = graph
  this.num_nodes = graph.Nodes.length
  this.starting_node = this.graph.Nodes[Math.floor(Math.random() * this.num_nodes)]
  this.starting_node.explored = true
  this.starting_node.explored_by = this.id
  this.x = this.starting_node.x
  this.y = this.starting_node.y

  var distances = this.graph.distMatrix[this.starting_node.id]
  this.target_node = this.graph.Nodes[distances.indexOf(Math.min(...distances))]
  this.graph.Edges.push(new Edge(this.starting_node, this.target_node))

  }

  explore(){
    var d,i,current_target,new_target_node, distances,distance_to_target, angle

    current_target = this.target_node
    distance_to_target = Math.sqrt((this.x - current_target.x)**2 + (this.y - current_target.y)**2)
    angle = Math.atan2(this.x - current_target.x,this.y - current_target.y)

    if (distance_to_target > alienSpeed){
      this.x -= alienSpeed * Math.sin(angle)
      this.y -= alienSpeed * Math.cos(angle)

    } else {
      distances = this.graph.distMatrix[current_target.id]

      if (!distances.some(isFinite)) {new_target_node = current_target} else {new_target_node = this.graph.Nodes[distances.indexOf(Math.min(...distances))]}

      // Make an edge between current node and closet node
      this.graph.Edges.push(new Edge(current_target, new_target_node))

      // Want to set the distances to explored nodes to Inf + update current node we are exploring
      this.target_node = new_target_node
      new_target_node.explored = true
      new_target_node.explored_by = this.id

      // Can't go to the node we are visiting
      for (d of this.graph.distMatrix) {d[new_target_node.id] = Infinity}
  }

  }
}


class Controller{
  constructor(n_nodes,n_aliens){
    context= myCanvas.getContext('2d');
    context.canvas.width  = window.innerWidth;
    context.canvas.height = window.innerHeight;

    this.graph = new Graph(context.canvas.width,context.canvas.height,n_nodes)
    this.graph.distMatrix = this.graph.getDistances()

    this.aliens = []
    for (var j=0;j < n_aliens;j++){
      this.aliens.push(new Alien(this.graph))
    }

  }

  step(){
    for (var alien of this.aliens){alien.explore()}
    plotGraph(this.graph,this.aliens)
  }

}


function plotGraph(graph,aliens){
  // clear space
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  // Plot edges
  // Plot first to hide lines
  for (edge of graph.Edges){
    context.beginPath();
    context.strokeStyle = "#696969"
    context.setLineDash([5, 15]);
    context.moveTo(edge.Node1.x, edge.Node1.y);
    context.lineTo(edge.Node2.x, edge.Node2.y);
    context.stroke();
  }
  // Plot nodes
  for (node of graph.Nodes){

    if (node.explored) {context.fillStyle = alienColors[node.explored_by]} else {context.fillStyle = "#000000"}
    context.beginPath()
    context.arc(node.x, node.y, 8, 0, Math.PI * 2, true);
    context.fill()
  }

  for (alien of aliens){
    context.beginPath();
    context.moveTo(alien.x, alien.y);
    context.lineTo(alien.x - 0.03 * context.canvas.width, alien.y -0.03 * context.canvas.width );
    context.lineTo(alien.x + 0.03 * context.canvas.width, alien.y  - 0.03 * context.canvas.width);
    context.closePath();

    // context.fillStyle = alienColors[alien.id];
    context.fillStyle = alienColors[alien.id]
    context.fill();
  }

}
//   Controlling
function init() {
  n_nodes = 30;
  n_aliens = 2;
  controller = new Controller(n_nodes,n_aliens)

  setInterval(function(){controller.step()},10)



}
