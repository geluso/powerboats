const Config = require('./config');

const TileSpace = require('./geo/tile-space')
const Course = require('./course')
const Game = require('./game')
const Screen = require('./screen')

const RandomTileCreator = require('./geo/tile-creators/random-tile-creator');
const JSONTileCreator = require('./geo/tile-creators/json-tile-creator');

const Boat = require('./boat');

const PlayerSelection = require('./player/player-selection')
const LocalControls = require('./player/local-controls')
const RemoteControls = require('./player/remote-controls')
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
    const game = createLocalGame();
    beginRender(game, isLocal);
  } else {
    const url = 'http://localhost:3000/games/rainier';
    fetchRemoteGame(url).then(game => {
      beginRender(game, isLocal);
    });
  }
}

function beginRender(game, isLocal) {
  console.log(game.tilespace.toString());

  // set up the screen
  var width = window.innerWidth;
  var height = window.innerHeight;
  const screen = new Screen(width, height, game);

  // set up the controls
  PlayerSelection.init(game, screen);
  if (isLocal) {
    LocalControls.initializeControls(screen, game);
  } else {
    console.log('remote controls')
    RemoteControls.initializeControls(screen, game);
  }

  game.getCurrentPlayer().highlightRoute()

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
  const tilespace = new TileSpace(rows, cols, randomTiles);
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
      debugger
      return createLocalGame();
    });
}