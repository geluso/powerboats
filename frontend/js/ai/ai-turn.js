const CONFIG = require('../config')

class AITurn {
  constructor(game, strategyClass) {
    this.game = game;
    this.strategy = new strategyClass(game);
  }

  initiateTurnStart() {
    this.waitDelay();
  }

  waitDelay() {
    var that = this;
    setTimeout(function () {
      that.considerOptions();
    }, CONFIG.AI_TURN_DELAY);
  }

  considerOptions() {
    var isStrategyResolved = this.strategy.churn();

    var boat = this.game.getCurrentPlayer();
    boat.highlightRoute();
    draw();

    if (isStrategyResolved) {
      this.submitTurn();
    } else {
      this.waitDelay();
    }
  }

  submitTurn() {
    GAME.endTurn();
  }
}

if (!!module) {
  module.exports = AITurn;
}