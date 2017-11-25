function ThreeBuoyBoard() {
  this.type = "Three Buoys";
  this.players = 6;

  this.start = undefined;
  this.startDirection = undefined;
  this.buoys = [];
  this.finishLineDetector = new FinishLineDetector();
}

ThreeBuoyBoard.prototype = new FullscreenBoard();

ThreeBuoyBoard.prototype.init = function(tilespace) {
  // Let the original Board set up itself.
  FullscreenBoard.prototype.init.call(this, tilespace);
  
  var startPos;
  if (CONFIG.USE_BUOY_ARRAY) {
    startPos = CONFIG.START_POSITION;
    for (var i = 0; i < CONFIG.BUOYS.length; i++) {
      var buoyKey = CONFIG.BUOYS[i];
      var tile = this.tilespace.getByKey(buoyKey);
      var buoy = new Buoy(i + 1, tile);
      this.buoys.push(buoy);
      tile.buoy = buoy;
    }
  } else {
    startPos = _.sample(this.tilespace.tiles);
    var buoysPlaced = 1;
    while (buoysPlaced <= this.NUMBER_OF_BUOYS) {
      var tile = _.sample(this.tilespace.tiles);
      var buoy = new Buoy(buoysPlaced, tile);
      this.buoys.push(buoy);

      tile.buoy = buoy;
      buoysPlaced++;
    }
  }

  this.start = startPos;
  this.startDirection = CONFIG.START_DIRECTION;
  this.start.resource = START_RED;

  this.finishLineDetector.add(this.start);

  var max = 5;
  var i = 1;
  var tile = this.start;
  while (i <= max) {
    tile = space.nextTileInDirection(tile, this.startDirection);
    this.finishLineDetector.add(tile);

    if (tile.resource) {
      if (i === max) {
        tile.resource = START_RED;
      } else if (i % 2 === 1) {
        tile.resource = START_WHITE;
      } else {
        tile.resource = START_BLACK;
      }
    }
    i++;
  }

  return this;
};

function createFinishLine() {

}

ThreeBuoyBoard.prototype.NUMBER_OF_BUOYS = 3;
