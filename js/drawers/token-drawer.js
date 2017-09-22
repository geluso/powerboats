
function TokenDrawer(ctx) {
  this.ctx = ctx;

  this.draw = function(token, x, y) {
    var TOKEN_SIZE = TILE_SIZE * .75;
    this.ctx.save();

    this.ctx.translate(x, y);

    var radius = TOKEN_SIZE; // Arc radius
    var startAngle = 0; // Starting point on circle
    var endAngle = 2 * Math.PI; // End point on circle

    for (var i = 0; i < 2; i++) {
      var path = new Path2D();
      path.arc(0, 0, radius, startAngle, endAngle);

      if (i % 2 == 0) {
        ctx.fillStyle = "red";
      } else {
        ctx.fillStyle = "white";
      }
      ctx.fill(path);
      ctx.stroke(path);

      radius *= .60;
    }

    ctx.fillStyle = "black";

    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "12px sans-serif";
    this.ctx.fillText(token.value, 0, 0);

    this.ctx.restore();
  }
}
