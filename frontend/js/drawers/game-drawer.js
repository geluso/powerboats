const Tile = require('../tile');
const TileDrawer = require('./tile-drawer');
const BoatDrawer = require('./boat-drawer');

const Point = require('../geo/point');
const Hexagon = require('../geo/hexagon');

class GameDrawer {
  constructor(ctx, currentGame) {
    this.ctx = ctx;
    this.currentGame = currentGame;

    this.measure();

    this.tileDrawer = new TileDrawer(ctx, currentGame);
    this.boatDrawer = new BoatDrawer(ctx, currentGame);
  }

  measure() {
    const TILE_HEIGHT = this.ctx.height / this.currentGame.game.tilespace.rows / 4;
    const HALF_EDGE = TILE_HEIGHT / (Math.sqrt(3) / 2);
    const EDGE_LENGTH = HALF_EDGE * 2;
    const TILE_SIZE = EDGE_LENGTH;
    Tile.setTileSize(TILE_SIZE);

    for (var row = 0; row <= this.currentGame.game.tilespace.rows; row++) {
      for (var col = 0; col < this.currentGame.game.tilespace.cols; col++) {
        let xOff = TILE_SIZE * 1.5;
        let yOff = TILE_SIZE * 1.72;

        let x = xOff * col;
        let y = yOff * row;

        if (col % 2 === 1) {
          y += TILE_SIZE * 0.86;
        }

        const tile = this.currentGame.game.tilespace.getByKeyRowCol(row, col)
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
    const game = this.currentGame.game;

    this.ctx.save();

    // draw water tiles first, then land tiles.
    this.tileDrawer.drawTiles(this.currentGame.game.tilespace.tiles);

    // draw tiles
    for (var i = 0; i < this.currentGame.game.tilespace.tiles.length; i++) {
      if (this.currentGame.game.tilespace.tiles[i].hover) {
        var tile = this.currentGame.game.tilespace.tiles[i];
        var highlightColor = game.getCurrentPlayer().color;
        Point.draw(this.ctx, tile, highlightColor);
      }
    }

    // draw boats
    for (var i = 0; i < game.boats.length; i++) {
      var boat = game.boats[i];
      boat.tile = this.currentGame.game.tilespace.getByKeyRowCol(boat.tile.row, boat.tile.col);
      this.boatDrawer.draw(boat);
    }
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = GameDrawer;
}