var context;
var nodeID = 0;
var alienID = 0;
var alienSpeed = 0.01 * window.innerWidth; // expressed as a fraction of the screen width
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

  this.node_location = Math.floor(Math.random() * this.num_nodes)
  graph.Nodes[this.node_location].explored = true
  graph.Nodes[this.node_location].explored_by = this.id

  }

  explore(){
    var d,i,current_node,closest_node, distances

    current_node = this.graph.Nodes[this.node_location]
    distances = this.graph.distMatrix[this.node_location]

    if (!distances.some(isFinite)) {closest_node = current_node} else {closest_node = this.graph.Nodes[distances.indexOf(Math.min(...distances))]}

    // Make an edge between current node and closet node
    this.graph.Edges.push(new Edge(current_node, closest_node))

    // Want to set the distances to explored nodes to Inf + update current node we are exploring
    this.node_location = closest_node.id
    closest_node.explored = true
    closest_node.explored_by = this.id

    // Can't go to the node we are visiting
    for (d of this.graph.distMatrix) {d[closest_node.id] = Infinity}

    // Finally, we plot after we update
    plotGraph(this.graph)
  }
}


class Controller{
  constructor(n_nodes,n_aliens){
    context= myCanvas.getContext('2d');
    context.canvas.width  = window.innerWidth;
    context.canvas.height = window.innerHeight;

    this.graph = new Graph(context.canvas.width,context.canvas.height,n_nodes)
    this.aliens = []

    for (var j=0;j < n_aliens;j++){
      this.aliens.push(new Alien(this.graph))
    }

    this.graph.distMatrix = this.graph.getDistances()
  }

  step(){
    for (var alien of this.aliens){
      alien.explore()
    }

  }

}


function plotGraph(Graph){
  // Plot edges
  // Plot first to hide lines
  for (edge of Graph.Edges){
    context.beginPath();
    context.strokeStyle = "#696969"
    context.setLineDash([5, 15]);
    context.moveTo(edge.Node1.x, edge.Node1.y);
    context.lineTo(edge.Node2.x, edge.Node2.y);
    context.stroke();
  }
  // Plot nodes
  for (node of Graph.Nodes){

    if (node.explored) {context.fillStyle = alienColors[node.explored_by]} else {context.fillStyle = "#000000"}
    context.beginPath()
    context.arc(node.x, node.y, 8, 0, Math.PI * 2, true);
    context.fill()

  }
}
//   Controlling
function init() {
  n_nodes = 30;
  n_aliens = 1;
  controller = new Controller(n_nodes,n_aliens)

  setInterval(function(){controller.step()},1000)



}
