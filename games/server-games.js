const Config = require('../frontend/js/config');

const TileSpace = require('../frontend/js/geo/tile-space');
const Course = require('../frontend/js/course');
const Game = require('../frontend/js/game');
const Boat = require('../frontend/js/boat');

const RoutePlanner = require('../frontend/js/ai/route-planner');

const RandomTileCreator = require('../frontend/js/geo/tile-creators/random-tile-creator');

class ServerGames {
  constructor() {
    this.games = {};
    this.chats = {};
    this.history = {};
    this.socketsToColors = {};
    this.colorsToSockets = {};
  }

  createGame(name) {
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

    this.games[name] = game;
    game.name = name;

    // create a history for this game.
    if (this.history[name] === undefined) {
      this.history[name] = [{ color: 'black', message: 'game created' }];
    }

    // create a chat for this game.
    if (this.chats[name] === undefined) {
      this.chats[name] = [];
    }

    return game;
  }

  getGame(name) {
    const game = this.games[name];
    return game;
  }

  // this.socketsToColors = {};
  // this.colorsToSockets = {};
  join(gameName, socket) {
    const game = this.getGame(gameName);
    for (let i = 0; i < game.boats.length; i++) {
      const color = game.boats[i].color;
      const currentSocketId = this.colorsToSockets[color];
      if (currentSocketId === undefined || currentSocketId === null) {
        this.colorsToSockets[color] = socket.id;
        this.socketsToColors[socket.id] = color;
        return color;
      }
    }
  }

  leave(gameName, socket) {
    const game = this.getGame(gameName);
    const color = this.socketsToColors[socket.id];
    this.colorsToSockets[color] = null;
    return color;
  }

  handleAction(command) {
    const { gameName, color, action, direction, params } = command;

    const game = this.games[gameName];
    const player = game.getPlayer(color);
    player.direction = direction;

    if (action === 'goStraight') {
      player.goStraight();
      game.nextTurn();
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

  aiTurn(game, color) {
    const boat = game.getPlayer(color);
    const planner = new RoutePlanner(boat);
    const actions = planner.execute();

    return actions;
  }

  newMap(gameName) {
    const game = this.createGame();
    this.games[gameName] = game;
    return game;
  }

  getChat(gameName) {
    const chat = this.chats[gameName];
    return chat;
  }

  getHistory(gameName) {
    const history = this.history[gameName];
    return history;
  }

  handleChat(command) {
    const { gameName, color, message, username } = command;
    const chat = this.chats[gameName];

    const chatMessage = { color, message, username };
    chat.push(chatMessage);
    return chatMessage;
  }
}

module.exports = ServerGames;