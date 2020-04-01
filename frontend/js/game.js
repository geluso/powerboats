var OFF_CENTER_INDEX = 0;
var CAN_ADJUST_SPEED = false;

const CONFIG = require('./config')

const Boat = require('./boat');
const AITurn = require('./ai/ai-turn');

class Game {
  constructor(board) {
    this.board = board;
    board.game = this;

    // HACK: start it at -1 so it slips into zero by starting with ending a turn.
    this.currentPlayerIndex = -1;
    this.boats = [];

    var colors = CONFIG.COLORS;
    var index = 0;
    var currentTile = board.start;
    var types = CONFIG.PLAYER_TYPES;
    while (index < colors.length) {
      var type = types[index];
      var boat = new Boat(this, colors[index], currentTile, type);
      this.boats.push(boat);

      currentTile = this.board.tilespace.nextTileInDirection(currentTile, board.startDirection);

      index++;
    }
  }

  toJSON() {
    return {
      currentPlayerIndex: this.currentPlayerIndex,
      boats: this.boats.map(boat => boat.toJSON()),
      tiles: this.board.land.map(tile => tile.toJSON())
    }
  }

  draw() {
    this.board.draw();
  }

  getCurrentPlayer() {
    var player = this.boats[this.currentPlayerIndex];
    return player;
  }

  endTurn() {
    if (this.getCurrentPlayer()) {
      this.getCurrentPlayer().unhighlightRoute();
    }
    draw();

    var that = this;
    setTimeout(function () {
      that.delayedEndTurn();
    }, CONFIG.AI_TURN_DELAY);
  }

  delayedEndTurn() {
    this.currentPlayerIndex++;
    this.currentPlayerIndex %= this.boats.length;

    if (this.getCurrentPlayer().isAI()) {
      var strategyClass = CONFIG.ALL_AI_STRATEGY;
      var ai = new AITurn(this, strategyClass);
      ai.initiateTurnStart();
    } else {
      this.resetRestrictions();
    }

    this.getCurrentPlayer().highlightRoute();
    draw();
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
    draw();
  }

  resetRestrictions() {
    OFF_CENTER_INDEX = 0;
    CAN_ADJUST_SPEED = true;
  }
}


if (typeof module !== "undefined" && !!module) {
  module.exports = Game;
}