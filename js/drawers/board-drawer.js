function BoardDrawer(ctx, game) {
  this.ctx = ctx;

  this.game = game;
  this.board = game.board;

  this.tileDrawer = new TileDrawer(ctx);
  this.boatDrawer = new BoatDrawer(ctx);
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

  for (var i = 0; i < board.tiles.length; i++) {
    if (board.tiles[i].hover) {
      var tile = board.tiles[i];
      Point.draw(this.ctx, tile);
    }
  }

  for (var i = 0; i < board.boats.length; i++) {
    var boat = board.boats[i];
    this.boatDrawer.draw(boat);
  }

  for (var i = 0; i < board.buoys.length; i++) {
    var buoy = board.buoys[i];
    var center = buoy.tile;

    var north = this.board.tilespace.getByKey(center.north());
    var northWest = this.board.tilespace.getByKey(center.northWest());
    var northEast = this.board.tilespace.getByKey(center.northEast());

    var south = this.board.tilespace.getByKey(center.south());
    var southWest = this.board.tilespace.getByKey(center.southWest());
    var southEast = this.board.tilespace.getByKey(center.southEast());

    Point.draw(this.ctx, north, "orange");
    Point.draw(this.ctx, northWest, "orange");
    Point.draw(this.ctx, northEast, "orange");

    Point.draw(this.ctx, south, "orange");
    Point.draw(this.ctx, southWest, "orange");
    Point.draw(this.ctx, southEast, "orange");
  }
};
