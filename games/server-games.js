const Config = require('../frontend/js/config');

const TileSpace = require('../frontend/js/geo/tile-space');
const Course = require('../frontend/js/course');
const Game = require('../frontend/js/game');
const Boat = require('../frontend/js/boat');

const RandomTileCreator = require('../frontend/js/geo/tile-creators/random-tile-creator');

class ServerGames {
  constructor() {
    this.games = {};
  }

  getGame(name) {
    return this.games[name];
  }

  createGame(name) {
    const randomTiles = new RandomTileCreator(1 / 10);
    const rows = 25;
    const cols = 25;
    const tilespace = new TileSpace(rows, cols, randomTiles);

    const course = new Course(tilespace);
    course.setupBuoys();
    course.setupStartLine(course.start, Config.START_DIRECTION);

    // create game and place boats
    const game = new Game(course);
    console.log(game.tilespace.toString());

    let currentTile = course.start;
    for (let i = 0; i < Config.PLAYER_TYPES.length; i++) {
      const color = Config.COLORS[i];
      const playerType = Config.PLAYER_TYPES[i];
      const boat = new Boat(game, color, currentTile, playerType, Config.START_DIRECTION);
      game.boats.push(boat);
      boat.faceBuoy();

      currentTile = course.tilespace.nextTileInDirection(currentTile, course.startDirection);
    }

    this.games[name] = game;
    game.name = name;

    return game;
  }

  handleAction(command) {
    const { gameName, color, action, direction } = command;

    const game = this.games[gameName];
    const player = game.getPlayer(color);
    player.direction = direction;

    if (action === 'goStraight') {
      player.goStraight();
    } else if (action === 'speedUp') {
      player.speedUp();
    } else if (action === 'slowDown') {
      player.slowDown();
    } else if (action === 'turnLeft') {
      player.turnLeft();
    } else if (action === 'turnRight') {
      player.turnRight();
    }

    return player;
  }
}

module.exports = ServerGames;