const Dice = require('./dice')
const RoutePlanner = require('./route-planner');
const BuoyDetector = require('./buoy-detector');
const Resources = require('./resources')
const TileGeo = require('./geo/tile-geo')

class Boat {
  constructor(game, color, tile, type, direction) {
    this.game = game;

    this.tile = tile;
    this.direction = direction;
    this.dice = [new Dice(1)];

    this.damage = 0;
    this.color = color;
    this.type = type;

    this.trackers = [];
    this.planner = new RoutePlanner(this);

    // the highest buoy that this boat has circled.
    this.trackerIndex = 0;

    // add trackers for each buoy
    for (var i = 0; i < this.game.course.buoys.length; i++) {
      var buoy = this.game.course.buoys[i];
      var buoyTracker = new BuoyDetector(this, buoy, this.game.tilespace);
      this.trackers.push(buoyTracker);
    }

    var finishTracker = game.course.finishLineDetector.clone();
    this.trackers.push(finishTracker);
  }

  static fromJSON(game, json) {
    let { damage, dice, color, tile, type, direction } = json;
    tile = game.tilespace.getByKeyRowCol(tile.row, tile.col);

    let boat = new Boat(game, color, tile, type);
    boat.damage = damage;
    boat.direction = direction;
    boat.dice = dice.map(dice => Dice.fromJSON(dice));
    return boat;
  }

  updateFromJSON(json) {
    this.damage = json.damage;
    this.color = json.color;
    this.tile = json.tile;
    this.type = json.type;
    this.direction = json.direction;
    this.dice = json.dice.map(dice => Dice.fromJSON(dice));
  }

  toJSON() {
    return {
      damage: this.damage,
      dice: this.dice,
      color: this.color,
      tile: this.tile,
      type: this.type,
      direction: this.direction
    }
  }

  isAI() {
    return this.type.includes("ai");
  }

  speed() {
    var total = this.dice.reduce(function (d1, d2) {
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
  }

  followRoute(isMovingBoatAlongRoute) {
    var route = this.getCurrentRouteTiles();
    var isTakingDamage = false;

    var damage = 0;
    for (var i = 0; i < route.length; i++) {
      var nextTile = route[i];
      if (!isTakingDamage && nextTile.resource !== Resources.LAND) {
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
      current = this.game.tilespace.nextTileInDirection(current, direction);
      if (current) {
        tiles.push(current);

        if (isTakingDamage || current.resource === Resources.LAND) {
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
      // to finish line!
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
    var clone = new BoatClone(this);
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

  coords() {
    var tile = this.tile;
    return [tile.xIndex, this.yIndex, this.zIndex];
  }
}

class BoatClone extends Boat {
  constructor(source) {
    super(source.game, source.color, source.tile, source.type);
    this.source = source;
    this.actions = [];
  }

  getFirstClone() {
    if (this.source.constructor === Boat) {
      return this;
    }

    return this.source.getFirstClone();
  }

  speedUp() {
    this.actions.push("faster");
    super.speedUp();
  }

  slowDown() {
    this.actions.push("slower");
    super.slowDown();
  }

  turnLeft() {
    this.actions.push("left");
    super.turnLeft();
  }

  turnRight() {
    this.actions.push("right");
    super.turnRight();
  }

  goStraight() {
    this.actions.push("go");
    super.goStraight();
  }
}


if (typeof module !== "undefined" && !!module) {
  module.exports = Boat;
}