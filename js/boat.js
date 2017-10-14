class Boat {
  constructor(game, color, tile, type) {
    this.game = game;
    this.damage = 0;
    this.dice = [new Dice()];

    this.planner = new RoutePlanner(game.board, this);

    this.color = color;
    this.tile = tile;
    this.type = type;

    // add trackers for each buoy
    this.trackers = [];
    for (var i = 0; i < this.game.board.buoys.length; i++) {
      var buoy = this.game.board.buoys[i];
      var buoyTracker = new BuoyDetector(this, buoy);
      this.trackers.push(buoyTracker);
    }

    var finishTracker = BOARD.finishLineDetector.clone();
    this.trackers.push(finishTracker);

    // the highest buoy that this boat has circled.
    this.trackerIndex = 0;

    this.direction = Directions.possibleDirections[0];
    this.faceBuoy();
  }

  isAI() {
    return this.type.includes("ai");
  }

  speed() {
    var total = this.dice.reduce(function(d1, d2) {
      return d1 + d2.value;
    }, 0);
    return total;
  }

  turnLeft() {
    this.direction = Directions.counterClockwiseNext[this.direction];
    this.tile.isDirty = true;
  }

  turnRight() {
    this.direction = Directions.clockwiseNext[this.direction];
    this.tile.isDirty = true;
  }

  checkRouteDamage() {
    var damage = this.followRoute(false);
    return damage;
  }

  goStraight() {
    var damage = this.followRoute(true);
    if (damage > 0) {
      this.damage += damage;
      this.dice = [];
    }

    this.finishMovement();
  }

  followRoute(isMovingBoatAlongRoute) {
    var route = this.getCurrentRouteTiles();
    var isTakingDamage = false;

    var damage = 0;
    for (var i = 0; i < route.length; i++) {
      var nextTile = route[i];
      if (!isTakingDamage && nextTile.resource !== LAND) {
        if (isMovingBoatAlongRoute) {
          // weird unhighlighting to get rid of all route
          // dots, and mark where the boat started as dirty.
          this.tile.unhighlight();
          this.tile = nextTile;
          this.tile.unhighlight();
          this.trackProgress();
        }
      } else {
        isTakingDamage = true;
        damage++;
      }
    }

    return damage;
  }

  finishMovement() {
    this.game.endTurn();
  }

  trackProgress() {
    if (this.trackerIndex < this.trackers.length) {
      var tracker = this.trackers[this.trackerIndex];
      tracker.track(this, this.tile);
    }
  }

  speedUp() {
    this.rollInNewDice();
  }

  slowDown() {
    this.dice.pop();
  }

  rollInNewDice() {
    var dice = new Dice();
    this.dice.push(dice);
  }

  removeDice(index) {
    this.dice.remove(index);
  }

  rerollDice(index) {
    this.dice[index].reroll();
  }

  highlightRoute() {
    this.unhighlightRoute();

    var tiles = this.getCurrentRouteTiles();
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].highlight();
    }

    this.currentlyHighlightedRoute = tiles;
    draw();
  }

  unhighlightRoute() {
    if (!this.currentlyHighlightedRoute) {
      return;
    }

    var tiles = this.currentlyHighlightedRoute;
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].unhighlight();
    }
  }

  getCurrentRouteTiles() {
    var tiles = [];
    var speed = this.speed();
    var direction = this.direction;

    var n = 0;
    var current = this.tile;
    var isTakingDamage = false;
    while (n < speed && current) {
      current = space.nextTileInDirection(current, direction);
      if (current) {
        tiles.push(current);

        if (isTakingDamage || current.resource === LAND) {
          isTakingDamage = true;
          current.givingDamage();
        }

        n++;
      }
    }

    return tiles;
  }

  targetNextBuoy() {
    this.trackerIndex++;
    if (this.trackerIndex >= 3) {
      console.log("to finish line!", this);
    }
  }

  straightToDistanceToBuoy() {
    var route = this.getCurrentRouteTiles();
    var routeEnd = route[route.length - 1];

    var currentBuoy = this.trackers[this.trackerIndex];

    var distance = TileGeo.distance(routeEnd, currentBuoy.tile);
    return distance;
  }

  leftTurnDistanceToBuoy() {

  }

  rightTurnDistanceToBuoy() {

  }

  // rotate in all directions and measure the distance to
  // the buoy. Remember what direction had the shortest
  // distance and make that the final facing direction.
  faceBuoy(allowedDirections) {
    if (allowedDirections === undefined) {
      allowedDirections = Directions.possibleDirections;
    }

    var minDistance = this.straightToDistanceToBuoy();
    var bestDirection = this.direction;

    for (var i = 0; i < allowedDirections.length; i++) {
      var direction = allowedDirections[i];
      this.direction = direction;
      var distance = this.straightToDistanceToBuoy();
      if (distance < minDistance) {
        minDistance = distance;
        bestDirection = this.direction;
      }
    }

    this.direction = bestDirection;
  }

  faceBuoyWithOneTurn() {
    var clockwise = Directions.clockwiseNext[this.direction];
    var counterClockwise = Directions.counterClockwiseNext[this.direction];
    var allowedDirections = [
      clockwise, this.direction, counterClockwise
    ];

    this.faceBuoy(allowedDirections);
  }

  clone() {
    var clone = new Boat(this.game, this.color, this.tile, this.type);
    clone.damage = this.damage;
    clone.direction = this.direction;
    clone.trackerIndex = this.trackerIndex;

    clone.dice = [];
    for (var i = 0; i < this.dice.length; i++) {
      var dice = new Dice();
      dice.value = this.dice[i].value;
      clone.dice.push(dice);
    }

    clone.trackers = [];
    for (var i = 0; i < this.trackers.length; i++) {
      var tracker = this.trackers[i].clone(clone);
      clone.trackers.push(tracker);
    }

    return clone;
  }
}
