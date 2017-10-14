class RoutePlanner {
  constructor(board, boat) {
    this.board = board;
    this.boat = boat;

    this.path = [];
  }

  explore(depth) {
    if (this.boat.explored) {
      return;
    }
    this.boat.explored = true;


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

      console.log(score, boat);

      if (score > bestScore) {
        bestScore = score;
        bestBoat = boat;
      }
    }

    GAME.boats.push(bestBoat);
    draw();
  }

  scoreTurn(boat) {
    var score = 0;

    // highly reward rounding a buoy
    score += 100 * boat.trackerIndex;

    var currentTracker = boat.trackers[boat.trackerIndex];
    score += 10 * currentTracker.pointsActivated;

    // slightly reward boats closer to the buoy
    score -= TileGeo.distance(boat.tile, currentTracker.tile);

    // slightly punish damage
    score -= 2 * boat.damage;
    return score;
  }
}
