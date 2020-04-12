const Point = require('../geo/point');

class RouteDrawer {
  static draw(ctx, boat) {
    const tiles = boat.getCurrentRouteTiles();
    tiles.forEach(tile => {
      Point.draw(ctx, tile, boat.color);
    });
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = RouteDrawer;
}