const Tile = require('../tile');
const TileDrawer = require('./tile-drawer');
const BoatDrawer = require('./boat-drawer');

const Point = require('../geo/point');
const Hexagon = require('../geo/hexagon');

class GameDrawer {
  constructor(ctx, game) {
    this.ctx = ctx;

    this.game = game;
    this.tilespace = game.tilespace;

    this.measure();

    this.tileDrawer = new TileDrawer(ctx, game);
    this.boatDrawer = new BoatDrawer(ctx, game);
  }

  measure() {
    const TILE_HEIGHT = this.ctx.height / this.tilespace.rows / 4;
    const HALF_EDGE = TILE_HEIGHT / (Math.sqrt(3) / 2);
    const EDGE_LENGTH = HALF_EDGE * 2;
    const TILE_SIZE = EDGE_LENGTH;
    Tile.setTileSize(TILE_SIZE);

    for (var row = 0; row <= this.tilespace.rows; row++) {
      for (var col = 0; col < this.tilespace.cols; col++) {
        let xOff = TILE_SIZE * 1.5;
        let yOff = TILE_SIZE * 1.72;

        let x = xOff * col;
        let y = yOff * row;

        if (col % 2 === 1) {
          y += TILE_SIZE * 0.86;
        }

        const tile = this.tilespace.getByKeyRowCol(row, col)
        if (tile) {
          tile.x = x;
          tile.y = y;

          const hexagon = new Hexagon(x, y, TILE_SIZE);
          tile.shape = hexagon;
        }
      }
    }

    return this;
  };


  draw() {
    var game = this.game;

    this.ctx.save();

    // draw water tiles first, then land tiles.
    this.tileDrawer.drawTiles(this.tilespace.tiles);

    // draw tiles
    for (var i = 0; i < this.tilespace.tiles.length; i++) {
      if (this.tilespace.tiles[i].hover) {
        var tile = this.tilespace.tiles[i];
        var highlightColor = this.game.getCurrentPlayer().color;
        Point.draw(this.ctx, tile, highlightColor);
      }
    }

    // draw boats
    for (var i = 0; i < game.boats.length; i++) {
      var boat = game.boats[i];
      boat.tile = this.tilespace.getByKeyRowCol(boat.tile.row, boat.tile.col);
      this.boatDrawer.draw(boat);
    }
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = GameDrawer;
}