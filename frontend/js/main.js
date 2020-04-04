const Config = require('./config');

const TileSpace = require('./geo/tile-space')
const Course = require('./course')
const Game = require('./game')
const Screen = require('./screen')

const RandomTileCreator = require('./geo/tile-creators/random-tile-creator');
const JSONTileCreator = require('./geo/tile-creators/json-tile-creator');

const Boat = require('./boat');

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
    const course = createLocalGame();
    beginRender(course);
  } else {
    const url = 'http://localhost:3000/games/rainier';
    fetchRemoteGame(url).then(beginRender);
  }
}

function beginRender(game) {
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

function createLocalGame() {
  const rows = 25;
  const cols = 55;

  const randomTiles = new RandomTileCreator();
  const jsonTiles = new JSONTileCreator({});
  const tilespace = new TileSpace(rows, cols, jsonTiles);
  const course = new Course(tilespace);

  course.setupBuoys();
  course.setupStartLine(course.start, Config.START_DIRECTION);

  const game = new Game(course);

  // create and place boats
  let currentTile = course.start;
  for (let i = 0; i < Config.PLAYER_TYPES.length; i++) {
    const color = Config.COLORS[i];
    const playerType = Config.PLAYER_TYPES[i];
    const boat = new Boat(game, color, currentTile, playerType);
    game.boats.push(boat);
    boat.faceBuoy();

    currentTile = course.tilespace.nextTileInDirection(currentTile, course.startDirection);
  }

  return game;
}

function fetchRemoteGame(url) {
  return fetch(url)
    .then(res => res.json())
    .then(json => {
      const game = Game.fromJSON(json.game);
      return game;
    })
    .catch(err => {
      console.log('network request failed. creating local game.');
      return createLocalGame();
    });
}