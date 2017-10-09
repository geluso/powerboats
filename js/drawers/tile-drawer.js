function TileDrawer(ctx) {
  this.ctx = ctx;

  this.drawTiles = function(tiles) {
    this.ctx.save();

    for (var i = 0; i < tiles.length; i++) {
      var tile = tiles[i];
      this.draw(tile);
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
    this.ctx.font = "6px serif";
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

    if (tile.isCoast) {
      _.each(tile.shape.getEdges(), function(edge) {

        if (edge.isCoast) {
          this.ctx.beginPath();
          this.ctx.moveTo(edge.c1.x, edge.c1.y);
          this.ctx.lineTo(edge.c2.x, edge.c2.y);

          if (edge.isPort) {
            this.ctx.fillStyle = edge.port.color;

            var midpointX = (tile.x - edge.c2.x) / 2 + edge.c2.x;
            var midpointY = (tile.y - edge.c2.y) / 2 + edge.c2.y;
            this.ctx.lineTo(midpointX, midpointY);

            midpointX = (tile.x - edge.c1.x) / 2 + edge.c1.x;
            midpointY = (tile.y - edge.c1.y) / 2 + edge.c1.y;
            this.ctx.lineTo(midpointX, midpointY);

            this.ctx.lineTo(edge.c1.x, edge.c1.y);

            this.ctx.fill();
            this.ctx.stroke();

            if (edge.port.ratio === 3) {
              this.ctx.strokeText("3:1", tile.x, tile.y);
            } else {
              this.ctx.strokeText("2:1", tile.x, tile.y);
            }
          } else {
            this.ctx.strokeStyle = "black";
            this.ctx.stroke();
          }
        }
      }, this);
    }

    this.ctx.restore();
  };
}
