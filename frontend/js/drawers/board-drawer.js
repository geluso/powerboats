const Tile = require('../tile');
const TileDrawer = require('./tile-drawer');
const BoatDrawer = require('./boat-drawer');

const Point = require('../geo/point');
const Hexagon = require('../geo/hexagon');

function BoardDrawer(ctx, game) {
  this.ctx = ctx;

  this.game = game;
  this.board = game.board;
  this.tilespace = game.board.tilespace;

  debugger
  this.measure();

  this.tileDrawer = new TileDrawer(ctx, game);
  this.boatDrawer = new BoatDrawer(ctx, game);
}

BoardDrawer.prototype.measure = function () {
  TILE_HEIGHT = this.ctx.height / this.tilespace.rows / 4;
  HALF_EDGE = TILE_HEIGHT / (Math.sqrt(3) / 2);
  EDGE_LENGTH = HALF_EDGE * 2;
  TILE_SIZE = EDGE_LENGTH;
  Tile.SetTileSize(TILE_SIZE);

  for (var row = 0; row < this.tilespace.rows; row++) {
    xIndex = 0;
    yIndex = -row;
    zIndex = row;
    for (var col = 0; col < this.tilespace.cols; col++) {
      var xOff = TILE_SIZE * 1.5;
      var yOff = TILE_SIZE * 1.72;

      var x = xOff * col;
      var y = yOff * row;

      const tile = this.tilespace.getByKeyRowCol(row, col)
      tile.x = x;
      tile.y = y;

      const hexagon = new Hexagon(x, y, TILE_SIZE);
      tile.shape = hexagon;
    }
  }

  return this;
};


BoardDrawer.prototype.draw = function () {
  var game = this.game;
  var board = this.board;

  this.ctx.save();

  debugger

  // draw water tiles first, then land tiles.
  if (board.land && board.water) {
    this.tileDrawer.drawTiles(board.water);
    this.tileDrawer.drawTiles(board.land);
  } else {
    this.tileDrawer.drawTiles(board.tiles);
  }

  // draw tiles
  for (var i = 0; i < board.tiles.length; i++) {
    if (board.tiles[i].hover) {
      var tile = board.tiles[i];
      var highlightColor = this.game.getCurrentPlayer().color;
      Point.draw(this.ctx, tile, highlightColor);
    }
  }

  // draw boats
  for (var i = 0; i < game.boats.length; i++) {
    var boat = game.boats[i];
    this.boatDrawer.draw(boat);
  }
};

if (typeof module !== "undefined" && !!module) {
  module.exports = BoardDrawer;
}