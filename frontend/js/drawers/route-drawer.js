const Point = require('../geo/point');

class RouteDrawer {
  static draw(ctx, boat, isDrawingNumbers = false) {
    const tiles = boat.getCurrentRouteTiles();
    tiles.forEach((tile, nn) => {
      Point.draw(ctx, tile, boat.color);
      ctx.strokeText(nn + 1, tile.x + 6, tile.y + 3);
    });
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = RouteDrawer;
}