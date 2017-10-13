Strategies = {};
Strategies.Turning = {};
Strategies.Speed = {};
Strategies.Damage = {};

Strategies.Turning.straightUnlessDamage = function(game) {
  console.log("considering options");
  var boat = game.getCurrentPlayer();
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
    return false;
  } else {
    return true;
  }
};

class Strategy {
  constructor(turnStrat, speedStrat, damageStrat) {
    this.turnStrat = turnStrat;
    this.speedStrat = speedStrat;
    this.damageStrat = damageStrat;
  }
}

class GoStraightUntilDamage {
  constructor(game) {
    this.game = game;
    this.considerations = [
      Strategies.Turning.straightUnlessDamage
    ];
  }

  churn() {
    for (var i = 0; i < this.considerations.length; i++) {
      var consider = this.considerations[i];
      var isComplete = consider(this.game);
      if (!isComplete) {
        return false;
      }
    }
    return true;
  }
}
