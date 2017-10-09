$(document).ready(main);

var DEBUG = false;
function debug() {
  DEBUG = true;
}

var space;
var board;
var game;
var SCREEN;

function main() {
  // load the game with the SixPlayerBoard by default.
  newGame(ThreeBuoyBoard);
}

function newGame(board) {
  if (SCREEN !== undefined) {
    SCREEN.destoryHandlers();
  }
  
  ClearLog();

  // determine the size
  var width = window.innerWidth;
  var height = window.innerHeight;

  space = new TileSpace().init(width, height);
  board = new board().init(space);

  // hanky hacks
  space.curateBoard();
  board.registerTileSpace(space);
  if (board.placePorts) {
    board.placePorts();
  }

  // hover the top left tile.
  var topLeft = space.keyedTiles["1,0,-1"];
  topLeft.resource = HOVERED;

  var n = 0;
  var current = topLeft;
  while (n < 10) {
    var seKey = current.southEast();
    console.log(seKey);
    var se = space.getByKey(current.southEast());
    se.resource = HOVERED;

    current = se;
    n++;
  }

  game = new Game(board);
  SCREEN = new Screen(width, height, game);
  SCREEN.draw();

}

function draw() {
  SCREEN.draw();
}
