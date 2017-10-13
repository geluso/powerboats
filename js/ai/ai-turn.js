class AITurn {
  constructor(game) {
    this.game = game;
    this.strategy = new GoStraightUntilDamage(game);
  }

  initiateTurnStart() {
    console.log("initiating turn");
    this.waitDelay();
  }

  waitDelay() {
    console.log("delaying");

    var that = this;
    setTimeout(function() {
      that.considerOptions();  
    }, CONFIG.AI_TURN_DELAY);
  }

  considerOptions() {
    var isStrategyResolved = this.strategy.churn();
    if (isStrategyResolved) {
      this.submitTurn();
    } else {
      this.waitDelay();
    }
  }

  submitTurn() {
    var boat = this.game.getCurrentPlayer();
    boat.goStraight();
  }
}
