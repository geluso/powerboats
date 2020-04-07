const Tile = require('../tile');
const BuoyTrackerDrawer = require('./buoy-tracker-drawer');

function BoatDrawer(ctx, currentGame) {
  this.ctx = ctx;
  this.currentGame = currentGame;

  this.draw = function (boat) {
    var x = boat.tile.x;
    var y = boat.tile.y;

    var LENGTH = Tile.TILE_SIZE;
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

    if (this.currentGame.game.getCurrentPlayer() === boat) {
      for (var j = 0; j < boat.trackers.length; j++) {
        var tracker = boat.trackers[j];
        BuoyTrackerDrawer.draw(tracker, this.ctx, boat.game.tilespace, boat.color);
      }
    }
  };
}

if (typeof module !== "undefined" && !!module) {
  module.exports = BoatDrawer;
}