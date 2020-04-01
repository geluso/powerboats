const Point = require('../geo/point');

function FullscreenBoard() {
  this.type = "board";
  this.players = 6;
}

FullscreenBoard.prototype.init = function (tilespace) {
  this.registerTileSpace(tilespace);
  return this;
};

FullscreenBoard.prototype.registerTileSpace = function (tilespace) {
  // make everything available that got refactored from Board to TileSpace
  this.tilespace = tilespace;

  this.tiles = tilespace.tiles;
  this.water = tilespace.water;
  this.land = tilespace.land;

  this.everything = tilespace.tiles;
};

FullscreenBoard.prototype.getTile = function (x, y) {
  var tile;

  for (var i = 0; i < this.tiles.length; i++) {
    var xx = Math.abs(this.tiles[i].x - x);
    var yy = Math.abs(this.tiles[i].y - y);
    if (xx < TILE_SIZE && yy < TILE_SIZE) {
      tile = this.tiles[i];
    }
  }

  return tile;
};

FullscreenBoard.prototype.getThing = function (x1, y1) {
  var closest;
  var minDistance = Infinity;
  for (var i = 0; i < this.everything.length; i++) {
    var x2 = this.everything[i].x;
    var y2 = this.everything[i].y;

    var distance = Point.distance(x1, y1, x2, y2);

    if (distance < minDistance) {
      closest = this.everything[i];
      minDistance = distance;
    }
  }

  return closest;
};

if (typeof module !== "undefined" && !!module) {
  module.exports = FullscreenBoard;
}