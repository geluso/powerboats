var CAN_ADJUST_SPEED = false;

const Config = require('./config')

const Course = require('./course');
const Boat = require('./boat');
const AITurn = require('./ai/ai-turn');

class Game {
  constructor(course) {
    this.course = course;
    this.tilespace = course.tilespace;

    this.boats = [];
    this.currentPlayerIndex = 0;
  }

  static fromJSON(json) {
    const course = Course.fromJSON(json.course);
    const game = new Game(course);

    json.boats.forEach(boat => {
      boat = Boat.fromJSON(game, boat);
      game.boats.push(boat);
    })

    game.currentPlayerIndex = json.currentPlayerIndex;

    return game;
  }

  toJSON() {
    return {
      course: this.course.toJSON(),

      currentPlayerIndex: this.currentPlayerIndex,
      boats: this.boats.map(boat => boat.toJSON()),

    }
  }

  updateFromJSON(json) {
    const boatLookup = {};
    this.boats.forEach(boat => {
      boat.tile.isDirty = true;
      boatLookup[boat.color] = boat;
    })

    json.boats.forEach(boatJSON => {
      const boat = boatLookup[boatJSON.color];
      boat.updateFromJSON(boatJSON);
    });

    this.getCurrentPlayer().highlightRoute();
  }

  updatePlayer(player) {
    const boatLookup = {};
    this.boats.forEach(boat => {
      boat.tile.isDirty = true;
      boatLookup[boat.color] = boat;
    })

    const boat = boatLookup[player.color];
    boat.updateFromJSON(player);
  }

  setCurrentPlayer(color) {
    this.getCurrentPlayer().unhighlightRoute();

    this.boats.forEach((boat, index) => {
      if (boat.color === color) {
        this.currentPlayerIndex = index;
        this.getCurrentPlayer().highlightRoute();
      }
    });
  }

  placeBoatsOnStartLine() {
    var colors = Config.COLORS;
    var index = 0;
    var currentTile = course.start;
    var types = Config.PLAYER_TYPES;
    while (index < colors.length) {
      var type = types[index];
      var boat = new Boat(this, colors[index], currentTile, type);
      this.boats.push(boat);

      currentTile = this.tilespace.nextTileInDirection(currentTile, course.startDirection);

      index++;
    }
  }

  getCurrentPlayer() {
    var player = this.boats[this.currentPlayerIndex];
    return player;
  }

  getPlayer(color) {
    for (let i = 0; i < this.boats.length; i++) {
      const boat = this.boats[i];
      if (boat.color === color) {
        return boat;
      }
    }
  }

  nextTurn() {
    this.currentPlayerIndex++;
    this.currentPlayerIndex %= this.boats.length;
  }

  endTurn() {
    if (this.getCurrentPlayer()) {
      this.getCurrentPlayer().unhighlightRoute();
    }

    setTimeout(() => {
      this.delayedEndTurn();
    }, Config.AI_TURN_DELAY);
  }

  delayedEndTurn(screen) {
    this.currentPlayerIndex++;
    this.currentPlayerIndex %= this.boats.length;

    if (this.getCurrentPlayer().isAI()) {
      var strategyClass = Config.ALL_AI_STRATEGY;
      var ai = new AITurn(screen, this, strategyClass);
      ai.initiateTurnStart();
    } else {
      this.resetRestrictions();
    }

    this.getCurrentPlayer().highlightRoute();
  }

  explore() {
    var length = this.boats.length
    for (var i = 0; i < length; i++) {
      this.boats[i].planner.explore();
    }
  }

  replaceCurrentBoat(newBoat) {
    var oldBoat = this.getCurrentPlayer();
    oldBoat.tile.isDirty = true;
    oldBoat.tile.hovering = false;

    this.boats[this.currentPlayerIndex] = newBoat;
  }

  resetRestrictions() {
    CAN_ADJUST_SPEED = true;
  }
}


if (typeof module !== "undefined" && !!module) {
  module.exports = Game;
}