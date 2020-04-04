const Config = require('./config');

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
    const course = createLocalCourse();
    beginRender(course);
  } else {
    const url = 'http://localhost:3000/games/rainier';
    fetchRemoteCourse(url).then(beginRender);
  }
}

function beginRender(course) {
  const game = new Game(course);

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

function createLocalCourse() {
  const rows = 25;
  const cols = 55;

  const randomTiles = new RandomTileCreator();
  const jsonTiles = new JSONTileCreator({});
  const tilespace = new TileSpace(rows, cols, jsonTiles);
  const course = new Course(tilespace);

  course.setupBuoys();
  course.setupStartLine(course.start, Config.START_DIRECTION);

  return course;
}

function fetchRemoteCourse(url) {
  return fetch(url)
    .then(res => res.json())
    .then(json => {
      const course = Course.fromJSON(json.course);
      return course;
    });
}