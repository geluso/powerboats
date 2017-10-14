class StraightUnlessDamage {
  constructor(game) {
    this.game = game;
    this.cycle = 0;
  }

  consider() {
    this.cycle++;
    if (this.cycle > 1) {
      return true;
    }

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

      return false;
    } else {
      return true;
    }
  }
};

class SpeedUpUntilDamage {
  constructor(game) {
    this.game = game;
    this.cycle = 0;
    this.MAX_SPEED = 5;
  }

  consider() {
    this.cycle++;

    // HACK: run the consideration, but falsely return
    // false so the drawing pauses for a slight delay
    if (this.cycle === 1) {
      var boat = this.game.getCurrentPlayer();
      var damage = boat.checkRouteDamage();
      if (damage === 0) {
        boat.speedUp();
        if (boat.speed() > 4) {
          var d1 = new Dice();
          var d2 = new Dice();
          d1.value = 3;
          d2.value = 1;
          boat.dice = [d1, d2];
        }
      }
      return false;
    }

    // boats are only allowed to speed up once,
    // so this strategy only executes once.
    return true;
  }
}

class FaceBuoy {
  constructor(game) {
    this.game = game;
    this.cycle = 0;
  }

  consider() {
    this.cycle++;

    // HACK: run the consideration, but falsely return
    // false so the drawing pauses for a slight delay
    if (this.cycle === 1) {
      var boat = this.game.getCurrentPlayer();
      boat.faceBuoyWithOneTurn();
      return false;
    }

    // boats are only allowed to speed up once,
    // so this strategy only executes once.
    return true;
  }
}

class UseRoutePlanner {
  constructor(game) {
    this.game = game;
    this.cycle = 0;
  }

  consider() {
    this.cycle++;

    // HACK: run the consideration, but falsely return
    // false so the drawing pauses for a slight delay
    if (this.cycle === 1) {
      var boat = this.game.getCurrentPlayer();
      boat.planner.explore();
      return false;
    }

    // boats are only allowed to speed up once,
    // so this strategy only executes once.
    return true;
  }
}


class ComposedStrategy {
  constructor(game, considerations) {
    this.churnNumber = {};
    this.game = game;
    this.considerations = [];
    for (var i = 0; i < considerations.length; i++) {
      var consideration = considerations[i];
      this.considerations.push(new consideration(this.game));
    }
  }

  churn() {
    for (var i = 0; i < this.considerations.length; i++) {
      var consideration = this.considerations[i];
      var isComplete = consideration.consider();
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
      StraightUnlessDamage
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
      SpeedUpUntilDamage,
      StraightUnlessDamage,
    ];

    this.runner = new ComposedStrategy(game, considerations);
  }

  churn() {
    return this.runner.churn();
  }
}

class TurnTowardBuoySlow {
  constructor(game) {
    var considerations = [
      FaceBuoy,
    ];

    this.runner = new ComposedStrategy(game, considerations);
  }

  churn() {
    return this.runner.churn();
  }
}

class TurnTowardBuoyFast {
  constructor(game) {
    var considerations = [
      FaceBuoy,
      SpeedUpUntilDamage,
    ];

    this.runner = new ComposedStrategy(game, considerations);
  }

  churn() {
    return this.runner.churn();
  }
}

class RoutePlanningStrategy {
  constructor(game) {
    var considerations = [
      UseRoutePlanner,
    ];

    this.runner = new ComposedStrategy(game, considerations);
  }

  churn() {
    return this.runner.churn();
  }
}
