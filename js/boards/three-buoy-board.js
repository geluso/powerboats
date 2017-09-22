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
  startFinish.resource = START_RED;

  var max = 5
  for (var i = 1; i <= max; i++) {
    var yy = startFinish.y + i * TILE_HEIGHT * 4;
    var thing = this.getTile(startFinish.x, yy);
    if (i === max) {
      thing.resource = START_RED;
    } else if (i % 2 === 1) {
      thing.resource = START_WHITE;
    } else {
      thing.resource = START_BLACK
    }
  }

  return this;
}

function createFinishLine() {

}

ThreeBuoyBoard.prototype.NUMBER_OF_BUOYS = 3;
