const CONFIG = require('../config')

class AITurn {
  constructor(screen, game, strategyClass) {
    this.screen = screen;
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

    if (isStrategyResolved) {
      this.submitTurn();
    } else {
      this.waitDelay();
    }
  }

  submitTurn() {
    this.game.endTurn();
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = AITurn;
}