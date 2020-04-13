const Config = require('../frontend/js/config');

const ServerSockets = require('./server-sockets');

const TileSpace = require('../frontend/js/geo/tile-space');
const Course = require('../frontend/js/course');
const Game = require('../frontend/js/game');
const Boat = require('../frontend/js/boat');

const RoutePlanner = require('../frontend/js/ai/route-planner');

const RandomTileCreator = require('../frontend/js/geo/tile-creators/random-tile-creator');

class ServerGame {
  constructor(io, gameName) {
    this.gameName = gameName;
    this.game = this.createGame();

    const ioNamespace = io.of('/' + gameName);
    new ServerSockets(ioNamespace, this);

    this.chat = [];
    this.history = [];
    this.socketsToColors = {};
    this.colorsToSockets = {};
  }

  createGame() {
    const randomTiles = new RandomTileCreator(1 / 10);
    const rows = 26;
    const cols = 48;
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
      const boat = new Boat(game, color, currentTile, playerType, Config.BOAT_START_DIRECTION);
      game.boats.push(boat);
      boat.faceBuoy();

      currentTile = course.tilespace.nextTileInDirection(currentTile, course.startDirection);
    }
    return game;
  }

  // this.socketsToColors = {};
  // this.colorsToSockets = {};
  join(socket) {
    for (let i = 0; i < this.game.boats.length; i++) {
      const color = this.game.boats[i].color;
      const currentSocketId = this.colorsToSockets[color];
      if (currentSocketId === undefined || currentSocketId === null) {
        this.colorsToSockets[color] = socket.id;
        this.socketsToColors[socket.id] = color;
        return color;
      }
    }
  }

  leave(socket) {
    const color = this.socketsToColors[socket.id];
    this.colorsToSockets[color] = null;
    return color;
  }

  handleAction(command) {
    const { color, action, direction, params } = command;
    const player = this.game.getPlayer(color);
    player.direction = direction;

    if (action === 'goStraight') {
      player.goStraight();
      this.game.nextTurn();
    } else if (action === 'rollDice') {
      player.rollDice(params.index);
    } else if (action === 'dropDice') {
      player.dropDice(params.index);
    } else if (action === 'turnLeft') {
      player.turnLeft();
    } else if (action === 'turnRight') {
      player.turnRight();
    }

    return player;
  }

  aiTurn(color) {
    const boat = this.game.getPlayer(color);
    const planner = new RoutePlanner(boat);
    const actions = planner.execute();

    return actions;
  }

  newMap() {
    const game = this.createGame();
    this.game = game;
    return game;
  }

  getChat() {
    return this.chat;
  }

  getHistory() {
    return this.history;
  }

  handleChat(command) {
    const { color, message, username } = command;
    const chatMessage = { color, message, username };
    this.chat.push(chatMessage);
    return chatMessage;
  }
}

module.exports = ServerGame;