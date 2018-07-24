function BoardDrawer(ctx, game) {
  this.ctx = ctx;

  this.game = game;
  this.board = game.board;

  this.tileDrawer = new TileDrawer(ctx);
}

BoardDrawer.prototype.draw = function() {
  var game = this.game;
  var board = this.board;

  this.ctx.save();

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
      var highlightColor = "yellow";
      Point.draw(this.ctx, tile, highlightColor);
    }
  }
};
