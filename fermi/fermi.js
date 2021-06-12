var context;
var nodeID = 0;

class Node {
  constructor(x,y) {this.x = x; this.y = y; this.explored = false; this.id = nodeID++}
}
class Edge{
  constructor(Node1,Node2) {this.Node1 = Node1 ; this.Node2 = Node2}
}

class Graph{
  constructor(width, height, num_nodes) {
  this.adjust = nodeID
  this.node_location = nodeID
  this.num_nodes = num_nodes
  this.width = width
  this.height = height
  this.Nodes = this.getNodes()
  this.Nodes[this.node_location - this.adjust].explored = true
  this.distMatrix = this.getDistances()
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

  explore(){
    var d,i,current_node,closest_node, distances

    current_node = this.Nodes[this.node_location - this.adjust]
    distances = this.distMatrix[this.node_location - this.adjust]

    if (!distances.some(isFinite)) {closest_node = current_node} else {closest_node = this.Nodes[distances.indexOf(Math.min(...distances))]}

    // Make an edge between current node and closet node
    this.Edges.push(new Edge(current_node, closest_node))

    // Want to set the distances to explored nodes to Inf + update current node we are exploring
    this.node_location = closest_node.id
    closest_node.explored = true

    // Can't go to the node we are visiting
    for (d of this.distMatrix) {d[closest_node.id - this.adjust] = Infinity}

    // Finally, we plot after we update
    plotGraph(this)
  }



}
function plotGraph(Graph){
  // Plot edges
  // Plot first to hide lines
  for (edge of Graph.Edges){
    context.beginPath();
    context.moveTo(edge.Node1.x, edge.Node1.y);
    context.lineTo(edge.Node2.x, edge.Node2.y);
    context.stroke();
  }
  // Plot nodes
  for (node of Graph.Nodes){
    if (node.id == Graph.node_location) {context.fillStyle = "#2193FF"} else if (node.explored) {context.fillStyle = "#BF14C7"} else {context.fillStyle = "#000000"}
    context.beginPath()
    context.arc(node.x, node.y, 8, 0, Math.PI * 2, true);
    context.fill()

  }
}















//   Controlling
function init() {
  ease_scale = 1
  context= myCanvas.getContext('2d');
  context.canvas.width  = window.innerWidth;
  context.canvas.height = window.innerHeight;
  graph1 = new Graph(context.canvas.width,context.canvas.height,12)
  graph2 = new Graph(context.canvas.width,context.canvas.height,12)


  setInterval(function(){graph1.explore();graph2.explore()}, 1000)
}
