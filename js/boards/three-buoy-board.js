function ThreeBuoyBoard() {
  this.type = "Three Buoys";
  this.players = 6;
  this.boats = [];

  this.start = undefined;
  this.startDirection = undefined;
  this.buoys = [];
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

  var startPos = CONFIG.START_POSITION;
  this.start = this.tilespace.getByKey(startPos);
  this.startDirection = Directions.randomDirection();
  this.start.resource = START_RED;

  var max = 5;
  var i = 1;
  var tile = this.start;
  while (i <= max) {
    tile = space.nextTileInDirection(tile, this.startDirection);

    if (i === max) {
      tile.resource = START_RED;
    } else if (i % 2 === 1) {
      tile.resource = START_WHITE;
    } else {
      tile.resource = START_BLACK;
    }
    i++;
  }

  var colors = CONFIG.COLORS;
  var index = 0;
  var current = this.start;
  while (index < colors.length) {
    var boat = new Boat(colors[index], current);
    this.boats.push(boat);

    current = space.nextTileInDirection(current, this.startDirection);

    index++;
  }

  PLAYER = this.boats[Math.floor(Math.random() * this.boats.length)];

  return this;
};

function createFinishLine() {

}

ThreeBuoyBoard.prototype.NUMBER_OF_BUOYS = 3;
