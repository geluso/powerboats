function BoatDrawer(ctx) {
  this.ctx = ctx;

  this.draw = function(boat) {
    var x = boat.tile.x;
    var y = boat.tile.y;

    var LENGTH = TILE_SIZE;
    var WIDTH = LENGTH / 2;
    this.ctx.save();

    this.ctx.translate(x, y);

    var degrees = Directions.directionToAngle[boat.direction];
    var radian = (degrees / 360) * (2 * Math.PI);
    this.ctx.rotate(radian);

    var path = new Path2D();

    x = 0;
    y = 0;

    // front of boat
    path.moveTo(x, y - LENGTH / 2);
    path.lineTo(x - WIDTH / 2, y);
    path.lineTo(x - WIDTH / 2, y + LENGTH / 2);
    path.lineTo(x + WIDTH / 2, y + LENGTH / 2);
    path.lineTo(x + WIDTH / 2, y);
    path.lineTo(x, y - LENGTH / 2);

    ctx.fillStyle = boat.color;
    ctx.fill(path);
    ctx.stroke(path);

    this.ctx.restore();

    if (GAME.getCurrentPlayer() === boat) {
      for (var j = 0; j < boat.trackers.length; j++) {
        var tracker = boat.trackers[j];
        tracker.draw(this.ctx);
      }
    }
  };
}
