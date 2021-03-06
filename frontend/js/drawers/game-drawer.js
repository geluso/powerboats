const Tile = require('../tile');
const TileDrawer = require('./tile-drawer');
const BoatDrawer = require('./boat-drawer');
const RouteDrawer = require('./route-drawer');

const Point = require('../geo/point');
const Hexagon = require('../geo/hexagon');

const PlayerSelection = require('../web-client/player-selection');

class GameDrawer {
  constructor(ctx) {
    this.ctx = ctx;

    this.tileDrawer = new TileDrawer(ctx);
    this.boatDrawer = new BoatDrawer(ctx);
  }

  measure(tilespace) {
    const TILE_HEIGHT = this.ctx.height / tilespace.rows / 4;
    const HALF_EDGE = TILE_HEIGHT / (Math.sqrt(3) / 2);
    const EDGE_LENGTH = HALF_EDGE * 2;
    const TILE_SIZE = EDGE_LENGTH;
    Tile.setTileSize(TILE_SIZE);

    for (let row = 0; row <= tilespace.rows; row++) {
      for (let col = 0; col < tilespace.cols; col++) {
        let xOff = TILE_SIZE * 1.5;
        let yOff = TILE_SIZE * 1.72;

        let x = xOff * col;
        let y = yOff * row;

        if (col % 2 === 1) {
          y += TILE_SIZE * 0.86;
        }

        const tile = tilespace.getByKeyRowCol(row, col)
        if (tile) {
          tile.isDirty = true;
          tile.x = x;
          tile.y = y;

          const hexagon = new Hexagon(x, y, TILE_SIZE);
          tile.shape = hexagon;
        }
      }
    }

    return this;
  };


  draw(game, playerMouses) {
    this.ctx.save();

    // draw water tiles first, then land tiles.
    const accentColor = game.getCurrentPlayer().color;
    this.tileDrawer.drawTiles(game.tilespace.tiles, accentColor);

    // draw boat routes 
    game.boats.forEach(boat => {
      const isCurrentTurn = boat === game.getCurrentPlayer();
      const isCurrentPlayer = boat.color === PlayerSelection.getCurrentPlayerColor();
      RouteDrawer.draw(this.ctx, boat, isCurrentPlayer);
    });

    // draw tiles
    for (let i = 0; i < game.tilespace.tiles.length; i++) {
      if (game.tilespace.tiles[i].hover) {
        const tile = game.tilespace.tiles[i];
        Point.draw(this.ctx, tile, tile.color);
      }
    }

    // color tiles according to where players have their cursors
    for (const color in playerMouses) {
      // using "tt" instead of "tile" because chrome debugger
      // gets confused and says second tile is undefined here in debugger console
      const tt = playerMouses[color];
      tt.isDirty = true;
      tt.hovering = true;
      TileDrawer.draw(this.ctx, tt, color);
    }

    // draw boats
    for (let i = 0; i < game.boats.length; i++) {
      const boat = game.boats[i];
      boat.tile = game.tilespace.getByKeyRowCol(boat.tile.row, boat.tile.col);

      const isCurrentPlayer = boat.color === PlayerSelection.getCurrentPlayerColor();
      this.boatDrawer.draw(boat, isCurrentPlayer);
    }
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = GameDrawer;
}