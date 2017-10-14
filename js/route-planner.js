class RoutePlanner {
  constructor(board, boat) {
    this.board = board;
    this.boat = boat;

    this.path = [];
  }

  explore(depth) {
    if (depth === undefined) {
      depth = 0;
    }

    if (depth === 4) {
      return;
    }

    var action1 = ["left", "straight", "right"];
    var action2 = ["slower", "same", "faster"];

    var options = [];
    for (var a1 = 0; a1 < action1.length; a1++) {
      for (var a2 = 0; a2 < action2.length; a2++) {
        var newBoat = this.boat.clone();
        options.push(newBoat);

        if (action1[a1] === "left") {
          newBoat.turnLeft();
        } else if (action1[a1] === "right") {
          newBoat.turnRight();
        }

        if (action2[a2] === "slower") {
          newBoat.slowDown();
        } else if (action2[a2] === "faster") {
          newBoat.speedUp();
        }

        // all boats go straight after making their other moves
        newBoat.goStraight();
      }
    }

    var bestScore = 0;
    var bestBoat = this.boat;
    for (var i = 0; i < options.length; i++) {
      var boat = options[i];
      var score = this.scoreTurn(boat);

      if (score > bestScore) {
        bestScore = score;
        bestBoat = boat;
      }
    }

    // replace old boat with the best option.
    GAME.replaceCurrentBoat(bestBoat);
  }

  scoreTurn(boat) {
    var score = 0;

    // highly reward rounding a buoy
    score += 100 * boat.trackerIndex;

    var currentTracker = boat.trackers[boat.trackerIndex];
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
