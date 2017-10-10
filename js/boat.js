DIRECTIONS = ["north", "north-east", "south-east", "south", "south-west", "north-west"];

class Boat {
  constructor(color, tile) {
    this.damage = 0;
    this.color = color;
    this.tile = tile;
    this.directionIndex = 0;
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
    this.directionIndex--;
    if (this.directionIndex === -1) {
      this.directionIndex = DIRECTIONS.length - 1;
    }
    this.direction = DIRECTIONS[this.directionIndex];
    this.tile.isDirty = true;
    draw();
  }

  turnRight() {
    this.directionIndex++;
    this.directionIndex %= DIRECTIONS.length;
    this.direction = DIRECTIONS[this.directionIndex];
    this.tile.isDirty = true;
    draw();
  }

  goStraight() {
    var route = this.getCurrentRouteTiles();
    var isTakingDamage = false;

    for (var i = 0; i < route.length; i++) {
      var nextTile = route[i];
      if (!isTakingDamage && nextTile.resource !== LAND) {
        this.tile = nextTile;
        BOARD.buoys[this.buoyIndex].buoyDetector.track(this.tile);
      } else {
        isTakingDamage = true;
        this.damage++;
      }
    }

    draw();
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
}
