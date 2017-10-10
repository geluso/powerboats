$(document).ready(main);

var DEBUG = false;
function debug() {
  DEBUG = true;
}

var space;
var BOARD;
var game;
var SCREEN;

function main() {
  // load the game with the SixPlayerBoard by default.
  newGame(ThreeBuoyBoard);
}

function newGame(board) {
  BOARD = board;

  if (SCREEN !== undefined) {
    SCREEN.destoryHandlers();
  }
  
  // determine the size
  var width = window.innerWidth;
  var height = window.innerHeight;

  space = new TileSpace().init(width, height);
  board = new board().init(space);

  // hanky hacks
  space.curateBoard();
  board.registerTileSpace(space);

  game = new Game(board);
  SCREEN = new Screen(width, height, game);
  SCREEN.draw();
  PLAYER.highlightRoute();

  CONTROLS.reportSpeed();
}

function draw() {
  SCREEN.draw();
}
