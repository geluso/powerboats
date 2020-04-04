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

  addBoat(boat) {

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

  getCurrentPlayer() {
    var player = this.boats[this.currentPlayerIndex];
    return player;
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