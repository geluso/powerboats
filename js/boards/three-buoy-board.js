function ThreeBuoyBoard() {
  this.type = "Three Buoys";
  this.players = 6;
}

ThreeBuoyBoard.prototype = new FullscreenBoard();

ThreeBuoyBoard.prototype.init = function(tilespace) {
  // Let the original Board set up itself.
  FullscreenBoard.prototype.init.call(this, tilespace);
  
  var buoysPlaced = 1;
  while (buoysPlaced <= this.NUMBER_OF_BUOYS) {
    var tile = _.sample(this.tilespace.tiles);
    tile.token = new Token(buoysPlaced);
    buoysPlaced++;
  }

  var startFinish = _.sample(this.tilespace.tiles);
  console.log(startFinish);

  return this;
}

ThreeBuoyBoard.prototype.NUMBER_OF_BUOYS = 3;
