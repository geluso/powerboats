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
  const isLocal = true;
  if (isLocal) {
    createLocalGame();
  } else {
    fetchRemoteGame();
  }
}

function createLocalGame() {
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
  const rows = 25;
  const cols = 55;

  space = new TileSpace(rows, cols);
  board = new board(space).init(space);
  const game = new Game(board);

  // determine the size
  var width = window.innerWidth;
  var height = window.innerHeight;
  const screen = new Screen(width, height, game);
  screen.draw();

  return { game, screen };
}

function fetchRemoteGame() {
  const url = 'http://localhost:3000/games/rainier';
  fetch()
    .then(res => res.json())
    .then(json => {

    });
}