const Tile = require('../tile')

class BuoyDrawer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  draw(buoy, x, y) {
    var BUOY_SIZE = Tile.TILE_SIZE * .75;
    this.ctx.save();

    this.ctx.translate(x, y);

    var radius = BUOY_SIZE; // Arc radius
    var startAngle = 0; // Starting point on circle
    var endAngle = 2 * Math.PI; // End point on circle

    for (var i = 0; i < 2; i++) {
      var path = new Path2D();
      path.arc(0, 0, radius, startAngle, endAngle);

      if (i % 2 == 0) {
        this.ctx.fillStyle = "red";
      } else {
        this.ctx.fillStyle = "white";
      }
      this.ctx.fill(path);
      this.ctx.stroke(path);

      radius *= .60;
    }

    // draw turn direction
    const direction = new Path2D();
    direction.arc(0, 0, 3 * 2 * radius, startAngle, endAngle);
    this.ctx.stroke(direction);

    this.ctx.fillStyle = "black";

    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "12px sans-serif";
    this.ctx.fillText(buoy.turnNumber, 0, 0);

    this.ctx.restore();
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = BuoyDrawer;
}