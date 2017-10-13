Strategies = {};
Strategies.Turning = {};
Strategies.Speed = {};
Strategies.Damage = {};

Strategies.Turning.StraightUnlessDamage = function(game) {
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

Strategies.Speed.SpeedUpUntilDamage = function(game) {
  var boat = game.getCurrentPlayer();
  var damage = boat.checkRouteDamage();
  if (damage === 0) {
    boat.speedUp();
    return false;
  }
  return true;
}

class Strategy {
  constructor(turnStrat, speedStrat, damageStrat) {
    this.turnStrat = turnStrat;
    this.speedStrat = speedStrat;
    this.damageStrat = damageStrat;
  }
}

class ComposedStrategy {
  constructor(game, considerations) {
    this.game = game;
    this.considerations = considerations;
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

class GoStraightUntilDamage {
  constructor(game) {
    var considerations = [
      Strategies.Turning.StraightUnlessDamage
    ];

    this.runner = new ComposedStrategy(game, considerations);
  }

  churn() {
    return this.runner.churn();
  }
}

class SpeedUpStraightUntilDamage {
  constructor(game) {
    var considerations = [
      Strategies.Speed.SpeedUpUntilDamage,
      Strategies.Turning.StraightUnlessDamage,
    ];

    this.runner = new ComposedStrategy(game, considerations);
  }

  churn() {
    return this.runner.churn();
  }
}
