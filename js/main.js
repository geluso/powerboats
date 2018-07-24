$(document).ready(main);

var DEBUG = false;
function debug() {
  DEBUG = true;
}

var space;
var BOARD;
var GAME;
var SCREEN;
var CURR_COLOR = "yellow";

function main() {
  // load the game with the SixPlayerBoard by default.
  newGame(FullscreenBoard);
  for (button of actions.getElementsByClassName("color-picker")){
      button.addEventListener("click", (ev) => {
        console.log("selected new color", ev.target);
        var color = button.getElementsByClassName("color")[0];
        CURR_COLOR = color.getAttribute("data-color");
    });
  }
}

function newGame(board) {
  if (SCREEN !== undefined) {
    SCREEN.destoryHandlers();
  }
  
  // determine the size
  var width = window.innerWidth;
  var height = window.innerHeight;

  space = new TileSpace().init(width, height);
  board = new board().init(space);
  BOARD = board;

  // hanky hacks
  space.curateBoard();
  board.registerTileSpace(space);

  GAME = new Game(board);
  SCREEN = new Screen(width, height, GAME);
  SCREEN.draw();
}

function draw() {
  SCREEN.draw();
}
