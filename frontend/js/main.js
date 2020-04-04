const TileSpace = require('./geo/tile-space')
const Course = require('./course')
const Game = require('./game')
const Screen = require('./screen')

const RandomTileCreator = require('./geo/tile-creators/random-tile-creator');
const JSONTileCreator = require('./geo/tile-creators/json-tile-creator');

const Controls = require('./player/controls')
const Keyboard = require('./keyboard')

$(document).ready(main);

var DEBUG = false;
function debug() {
  DEBUG = true;
}

function main() {
  // initialize the game and the board
  const isLocal = false;
  if (isLocal) {
    const { tilespace, course } = createLocalBoard();
    beginRender(tilespace, course);
  } else {
    const url = 'http://localhost:3000/games/rainier';
    fetchRemote(url)
      .then(({ tilespace, course }) => {
        beginRender(tilespace, course);
      });
  }
}

function beginRender(tilespace, course) {
  const game = new Game(tilespace, course);

  // set up the screen
  var width = window.innerWidth;
  var height = window.innerHeight;
  const screen = new Screen(width, height, game);

  // set up the controls
  const controls = Controls.initializeControls(screen, game);
  Keyboard.init(controls);

  // continually refresh
  function refresh() {
    screen.draw();
    requestAnimationFrame(refresh);
  }

  refresh();
}

function createLocalBoard() {
  const rows = 25;
  const cols = 55;

  const randomTiles = new RandomTileCreator();
  const jsonTiles = new JSONTileCreator({});
  const tilespace = new TileSpace(rows, cols, jsonTiles);
  const course = new Course(tilespace);
  course.setup();

  return { tilespace, course };
}

function fetchRemote(url) {
  return fetch(url)
    .then(res => res.json())
    .then(json => {
      const tilespace = TileSpace.fromJSON(json.tilespace);
      const course = new Course(tilespace);
      course.setup();
      // const course = Course.fromJSON(json);
      // return { tilespace, course };
      return { tilespace, course }
    });
}