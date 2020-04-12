const CONFIG = require('../config');
const BuoyDrawer = require('./buoy-drawer');

class TileDrawer {
  constructor(ctx) {
    this.ctx = ctx;
    this.buoyDrawer = new BuoyDrawer(ctx);
  }

  drawTiles(tiles, accentColor) {
    this.ctx.save();

    for (var i = 0; i < tiles.length; i++) {
      var tile = tiles[i];
      this.draw(tile, accentColor);

      if (tile.buoy) {
        this.buoyDrawer.draw(tile.buoy, tile.x, tile.y);
      }
    }

    this.ctx.restore();

  }

  draw(tile, accentColor) {
    TileDrawer.draw(this.ctx, tile, accentColor);
  }

  static draw(ctx, tile, accentColor) {
    if (!tile.isDirty) {
      return;
    }
    tile.isDirty = false;

    var stroke = "black";

    if (tile.hovering) {
      tile.shape.fillStroke(ctx, tile.color, stroke);
    } else {
      tile.shape.fillStroke(ctx, tile.resource.color, stroke);
    }

    ctx.save();
    ctx.font = CONFIG.COORD_TEXT_SIZE + " serif";
    ctx.textAlign = "center";
    ctx.textBaseLine = "hanging";

    //var drawCoords = CONFIG.DRAW_COORDS || (tile.hovering && CONFIG.DRAW_HOVER_COORDS);
    //if (drawCoords) {
    //  var indexLabel = [tile.row, tile.col, tile.zIndex].join(",");
    //  var sum = Math.abs(tile.xIndex) + Math.abs(tile.yIndex) + Math.abs(tile.zIndex);
    //  if (sum < 30 || true) {
    //    ctx.strokeText(indexLabel, tile.x, tile.y + 2);
    //  }
    //}

    ctx.restore();
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = TileDrawer;
}