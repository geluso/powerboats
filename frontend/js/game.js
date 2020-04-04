var CAN_ADJUST_SPEED = false;

const Config = require('./config')

const Boat = require('./boat');
const AITurn = require('./ai/ai-turn');

class Game {
  constructor(course) {
    this.course = course;
    this.tilespace = course.tilespace;

    this.currentPlayerIndex = 0;
    this.boats = [];

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

  toJSON() {
    return {
      currentPlayerIndex: this.currentPlayerIndex,
      boats: this.boats.map(boat => boat.toJSON()),
      tiles: this.tilespace.land.map(tile => tile.toJSON())
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