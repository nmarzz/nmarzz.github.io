


class point {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
}

function distance(a,b){
  return Math.sqrt(Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2) )
}

function edge(a,b,context){
  context.beginPath();
  context.moveTo(a.x, a.y);
  context.lineTo(b.x, b.y);
  context.stroke();
}

function compass(origin,context,r=20){
  context.beginPath();
  context.arc(origin.x, origin.y,r, 0, 2 * Math.PI);
  context.stroke();
}

function triangle(points,context){
  a = points[0];
  b = points[1];
  c = points[2];

  edge(a,b,context)
  edge(b,c,context)
  edge(c,a,context)

  // now draw compass ruler
  compass(a,context,r=distance(a,b))
  compass(a,context,r=distance(a,c))
  compass(b,context,r=distance(b,c))
}


export {triangle, edge,compass,point};
