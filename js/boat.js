class Boat {
  constructor(color, tile, type) {
    this.damage = 0;
    this.dice = [new Dice()];

    this.color = color;
    this.tile = tile;
    this.type = type;

    // the highest buoy that this boat has circled.
    this.buoyIndex = 0;

    this.direction = Directions.possibleDirections[0];
    this.faceBuoy();
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
    this.damage += damage;

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
    GAME.endTurn();
  }

  trackProgress() {
    if (this.buoyIndex < BOARD.buoys.length) {
      var buoy = BOARD.buoys[this.buoyIndex];
      var detector = buoy.buoyDetector;
      detector.track(this, this.tile);
    } else {
      BOARD.finishLineDetector.track(this, this.tile);
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
    this.buoyIndex++;
    if (this.buoyIndex >= 3) {
      console.log("to finish line!", this);
    }
  }

  straightToDistanceToBuoy() {
    var route = this.getCurrentRouteTiles();
    var routeEnd = route[route.length - 1];

    var currentBuoy = BOARD.buoys[this.buoyIndex];

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
}
