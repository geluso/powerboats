class AITurn {
  constructor(game) {
    this.game = game;
  }

  initiateTurnStart() {
    console.log("set up taking turn");
    var that = this;
    setTimeout(function() {
      console.log("taking turn");
      that.takeTurn();  
    }, CONFIG.AI_TURN_DELAY);
  }

  takeTurn() {
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
    }
    boat.goStraight();
  }
}
