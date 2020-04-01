const ThreeBuoyBoard = require('./boards/three-buoy-board')
const TileSpace = require('./geo/tile-space')
const Game = require('./game')
const Screen = require('./screen')

const Controls = require('./player/controls')
const Keyboard = require('./keyboard')

$(document).ready(main);

var DEBUG = false;
function debug() {
  DEBUG = true;
}

function main() {
  // load the game with the SixPlayerBoard by default.
  const { game, screen } = newGame(ThreeBuoyBoard);
  const controls = Controls.initializeControls(screen, game);
  Keyboard.init(controls);

  function refresh() {
    screen.draw();
    requestAnimationFrame(refresh);
  }

  refresh();
}

function newGame(board) {
  // determine the size
  var width = window.innerWidth;
  var height = window.innerHeight;

  space = new TileSpace().init(width, height);
  board = new board().init(space);

  // hanky hacks
  space.curateBoard();
  board.registerTileSpace(space);

  const game = new Game(board);
  const screen = new Screen(width, height, game);
  screen.draw(board);

  return { game, screen };
}
