const Point = require('../geo/point');

class DotRouteDrawer {
  static draw(ctx, boat, isDrawingNumbers = false) {
    const tiles = boat.getCurrentRouteTiles();
    tiles.forEach((tile, nn) => {
      Point.draw(ctx, tile, boat.color);
      ctx.strokeText(nn + 1, tile.x + 6, tile.y + 3);
    });
  }
}

class LineRouteDrawer {
  static draw(ctx, boat, isDrawingNumbers = false) {
    const tiles = boat.getCurrentRouteTiles();
    if (tiles.length === 0) return;

    const speeds = boat.dice.map(die => die.value).sort();
    const startTile = boat.tile
    const endTile = tiles[tiles.length - 1];

    boat.tile.isDirty = true;
    tiles.forEach(tile => tile.isDirty = true);

    const stopPoints = [];
    let index = -1
    while (speeds.length > 0) {
      const speed = speeds.pop();
      index += speed;
      const stopPoint = tiles[index];
      stopPoints.push(stopPoint)
    }

    ctx.save();

    ctx.lineWidth = 3;
    ctx.strokeStyle = boat.color;

    ctx.beginPath();
    ctx.moveTo(startTile.x, startTile.y);
    ctx.lineTo(endTile.x, endTile.y);
    ctx.stroke(); 

    ctx.restore();

    stopPoints.forEach(tile => Point.draw(ctx, tile, boat.color))
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = LineRouteDrawer;
}