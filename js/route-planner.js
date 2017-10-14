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

    var leftBoat = this.boat.clone();
    var straightBoat = this.boat.clone();
    var rightBoat = this.boat.clone();

    straightBoat.goStraight();

    leftBoat.turnLeft();
    leftBoat.goStraight();

    rightBoat.turnRight();
    rightBoat.goStraight();

    var bestScore = 0;
    var bestBoat = this.boat;
    var options = [leftBoat, straightBoat, rightBoat];
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
