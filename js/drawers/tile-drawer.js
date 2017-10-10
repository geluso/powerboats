function TileDrawer(ctx) {
  this.ctx = ctx;
  this.buoyDrawer = new BuoyDrawer(ctx);

  this.drawTiles = function(tiles) {
    this.ctx.save();

    for (var i = 0; i < tiles.length; i++) {
      var tile = tiles[i];
      this.draw(tile);

      if (tile.buoy) {
        this.buoyDrawer.draw(tile.buoy, tile.x, tile.y);
      }
    }

    this.ctx.restore();

  };

  this.draw = function(tile) {
    if (!tile.isDirty) {
      return;
    }
    tile.isDirty = false;

    var stroke = "black";

    if (tile.hovering) {
      tile.shape.fillStroke(this.ctx, HOVERED.color, stroke);
    } else {
      tile.shape.fillStroke(this.ctx, tile.resource.color, stroke);
    }

    this.ctx.save();
    this.ctx.font = "8px serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseLine = "hanging";
                          
    var drawCoords = CONFIG.DRAW_COORDS || (tile.hovering && CONFIG.DRAW_HOVER_COORDS);
    if (drawCoords) {
      var indexLabel = [tile.xIndex, tile.yIndex, tile.zIndex].join(",");
      var sum = Math.abs(tile.xIndex) + Math.abs(tile.yIndex) + Math.abs(tile.zIndex);
      if (sum < 30 || true) {
        this.ctx.strokeText(indexLabel, tile.x, tile.y + 2);
      }
    }

    this.ctx.restore();
  };
}
