DIRECTIONS = ["north", "north-east", "south-east", "south", "south-west", "north-west"];

class Boat {
  constructor(color, tile) {
    this.damage = 0;
    this.color = color;
    this.tile = tile;
    this.direction = Directions.randomDirection();

    this.dice = [new Dice()];

    // the highest buoy that this boat has circled.
    this.buoyIndex = 0;
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

    draw();
  }

  turnRight() {
    this.direction = Directions.clockwiseNext[this.direction];
    this.tile.isDirty = true;

    draw();
  }

  checkRouteDamage() {
    var damage = this.followRoute(false);
    return damage;
  }

  goStraight() {
    var damage = this.followRoute(true);
    this.damage += damage;

    this.finishMovement();
    draw();
  }

  followRoute(isMovingBoatAlongRoute) {
    var route = this.getCurrentRouteTiles();
    var isTakingDamage = false;

    var damage = 0;
    for (var i = 0; i < route.length; i++) {
      var nextTile = route[i];
      if (!isTakingDamage && nextTile.resource !== LAND) {
        if (isMovingBoatAlongRoute) {
          this.tile.unhighlight();
          this.tile = nextTile;
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
    var tiles = [this.tile];
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
}
