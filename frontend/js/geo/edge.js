const Point = require('./point');
const Corner = require('./corner');

const _ = require('lodash')

function Edge(c1, c2) {
  var x = (c1.x + c2.x) / 2;
  var y = (c1.y + c2.y) / 2;
  var p = new Point(x, y);

  this.x = p.x;
  this.y = p.y;

  var key = this.key();
  if (Edge.lookup[key]) {
    return Edge.lookup[key];
  } else {
    Edge.lookup[key] = this;
  }

  this.c1 = new Corner(c1.x, c1.y);
  this.c2 = new Corner(c2.x, c2.y);

  this.angle = angle(c1.x, c1.y, c2.x, c2.y);

  function angle(x0, y0, x1, y1) {
    var angle = Math.atan2(y1 - y0, x1 - x0);
    if (angle < 0) {
      angle = 2 * Math.PI + angle;
    }
    return angle;
  }

  Edge.prototype.key = function () {
    var key = [this.x, this.y].join(",");
    return key;
  }

  Edge.lookup = {};

  if (typeof module !== "undefined" && !!module) {
    module.exports = Edge;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = Edge;
}