class AITurn {
  constructor(game) {
    this.game = game;
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
    console.log("considering options");
    var boat = this.game.getCurrentPlayer();
    var damage = boat.checkRouteDamage();
    if (damage > 0) {
      var coin = Math.random() < .5;
      if (coin) {
        boat.turnLeft();
        console.log(boat.color, "turns left");
      } else {
        boat.turnRight();
        console.log(boat.color, "turns right");
      }

      boat.highlightRoute();
      this.waitDelay();
    } else {
      this.submitTurn();
    }
  }

  submitTurn() {
    var boat = this.game.getCurrentPlayer();
    boat.goStraight();
  }

}
