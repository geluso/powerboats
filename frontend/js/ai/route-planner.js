const FinishLineDetector = require('../finish-line-detector');
const TileGeo = require('../geo/tile-geo');

class RoutePlanner {
  constructor(boat) {
    this.boat = boat;
  }

  execute() {
    const bestActions = this.explore();
    console.log();
    console.log('best', bestActions);
    this.performActions(this.boat, bestActions);

    return bestActions;
  }

  explore() {
    if (this.boat.trackerIndex >= this.boat.trackers.length) {
      // once done spin in circles in place.
      console.log('ai thinks it is winning')
      const courseCompleteActions = ['slower', 'left', 'go'];
      return courseCompleteActions;
    }

    const options = this.deepExplore(this.boat);
    const bestBoat = this.findBestScore(options);
    const bestActions = bestBoat.getFirstClone().actions;
    return bestActions;
  }

  deepExplore(boat, depth = 1, options = []) {
    if (depth >= 3) {
      return options;
    }

    var action1 = ["left", "straight", "right"];
    var action2 = ["slower", "same", "faster"];
    var action3 = ["stay", "go"];

    for (var a1 = 0; a1 < action1.length; a1++) {
      for (var a2 = 0; a2 < action2.length; a2++) {
        for (var a3 = 0; a3 < action3.length; a3++) {

          var newBoat = boat.clone();

          // all boats go straight after making their other moves
          var actions = [action1[a1], action2[a2], action3[a3]];

          // don't let the boat cheat and stay in place when it has speed to burn.
          if (action3[a3] === 'stay' && boat.speed() > 0) {
            continue;
          }

          options.push(newBoat);

          // manipulate those actions
          this.performActions(newBoat, actions);
          newBoat.actions = newBoat.actions.concat(actions);

          this.deepExplore(newBoat, depth + 1, options);
        }
      }
    }

    return options;
  }

  // isOneTurn set to false allows a boat to explore many actions
  // set to true it stops performing actions as soon as one go is complete
  performActions(boat, actions, isOneTurn = false) {
    for (var i = 0; i < actions.length; i++) {
      if (actions[i] === "left") {
        boat.turnLeft();
      } else if (actions[i] === "right") {
        boat.turnRight();
      }

      if (actions[i] === "slower") {
        boat.dropDice(boat.dice.length - 1);
      } else if (actions[i] === "faster") {
        boat.rollDice(boat.dice.length);
      }

      if (actions[i] === "go") {
        boat.goStraight();
        if (isOneTurn) {
          return;
        }
      }
    }
  }

  findBestScore(options) {
    var bestScore = -Infinity;
    var bestBoat = options[0].boat;
    for (var i = 0; i < options.length; i++) {
      var boat = options[i];
      if (!boat) {
        continue;
      }

      var score = this.scoreTurn(boat);
      console.log(bestScore, score, options[i].actions);
      if (score > bestScore) {
        bestScore = score;
        bestBoat = boat;
      }
    }

    return bestBoat;
  }

  scoreTurn(boat) {
    var score = 0;

    // highly reward rounding a buoy
    score += 100 * boat.trackerIndex;

    var currentTracker = boat.trackers[boat.trackerIndex];
    if (!currentTracker) {
      return score;
    }

    score += 10 * currentTracker.pointsActivated;

    if (currentTracker instanceof FinishLineDetector) {
      score += 1000 * currentTracker.pointsActivated;
      score -= 2 * TileGeo.distance(boat.tile, currentTracker.tile);
    } else {
      // slightly reward boats closer to the buoy
      score -= TileGeo.distance(boat.tile, currentTracker.tile);
    }

    // slightly punish damage
    score -= 2 * boat.damage;

    // but keep boat from destroying itself.
    if (boat.damage >= 4) {
      return -Infinity;
    }

    return score;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = RoutePlanner;
}