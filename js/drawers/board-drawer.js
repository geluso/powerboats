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

  for (var i = 0; i < board.everything.length; i++) {
    if (board.everything[i].hover) {
      var thing = board.everything[i];
      Point.draw(this.ctx, thing.x, thing.y, 4);
    }
  }

  if (board.hovering) {
    
  }
};
