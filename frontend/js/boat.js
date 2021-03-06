const Config = require('./config');
const Dice = require('./dice');
const RoutePlanner = require('./ai/route-planner');
const BuoyTracker = require('./buoy-tracker');
const Resources = require('./resources');
const TileGeo = require('./geo/tile-geo');

class Boat {
  constructor(game, color, tile, type, direction) {
    this.game = game;

    this.tile = tile;
    this.direction = direction;
    this.dice = [];

    this.damage = 0;
    this.damageLocations = [];
    this.color = color;
    this.type = type;

    this.trackers = [];
    this.planner = new RoutePlanner(this);

    // the highest buoy that this boat has circled.
    this.trackerIndex = 0;

    // add trackers for each buoy
    for (var i = 0; i < this.game.course.buoys.length; i++) {
      var buoy = this.game.course.buoys[i];
      var buoyTracker = new BuoyTracker(buoy, this.game.tilespace);
      this.trackers.push(buoyTracker);
    }

    // var finishTracker = game.course.finishLineDetector.clone();
    // this.trackers.push(finishTracker);
  }

  stats() {
    return {
      color: this.color,
      damage: this.damage,
      direction: this.direction,
      speed: this.speed(),
      dice: this.diceStats(),
    }
  }

  diceStats() {
    const stats = this.dice.map(dice => dice.value);
    return stats;
  }

  static fromJSON(game, json) {
    let { color, tile, type } = json;
    tile = game.tilespace.getByKeyRowCol(tile.row, tile.col);

    let boat = new Boat(game, color, tile, type);
    boat.updateFromJSON(json);

    return boat;
  }

  updateFromJSON(json) {
    const { row, col } = json.tile;

    this.damage = json.damage;
    this.color = json.color;
    this.tile = this.game.tilespace.getByKeyRowCol(row, col);
    this.type = json.type;
    this.direction = json.direction;
    this.dice = json.dice.map(dice => Dice.fromJSON(dice));

    // trackers
    this.trackerIndex = json.trackerIndex;
    this.trackers = json.trackers.map(tracker => BuoyTracker.fromJSON(this.game, tracker));
  }

  toJSON() {
    return {
      damage: this.damage,
      dice: this.dice.map(dice => dice.toJSON()),
      speed: this.speed(),
      color: this.color,
      tile: this.tile,
      type: this.type,
      direction: this.direction,

      // trackers
      trackerIndex: this.trackerIndex,
      trackers: this.trackers.map(tracker => tracker.toJSON()),
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
    }
  }

  followRoute(isMovingBoatAlongRoute) {
    let route = this.getCurrentRouteTiles();
    let isTakingDamage = false;

    // go forward until hitting land
    let damage = 0;
    const path = [this.tile];
    for (let i = 0; i < route.length; i++) {
      let nextTile = route[i];
      if (isTakingDamage || !nextTile.isNavigable(this.game.course)) {
        isTakingDamage = true;
        damage++;
      } else {
        path.push(nextTile);
      }
    }

    // figure out where all other boats are
    const otherBoatLocations = new Set();
    this.game.boats.forEach(boat => {
      if (boat !== this) {
        const key = boat.tile.row + ',' + boat.tile.col;
        otherBoatLocations.add(key);
      }
    });

    // pop off end positions that are already taken by other boats
    let index = path.length - 1;
    let isFree = false;
    while (!isFree && index >= 0) {
      const tile = path[index];
      const key = tile.row + ',' + tile.col;
      if (!otherBoatLocations.has(key)) {
        isFree = true;
      } else {
        path.pop();
        index--;
      }
    }

    // now actually move the boat and track it's buoy progress across each tile.
    if (isMovingBoatAlongRoute) {
      path.forEach(tile => {
        this.tile = tile;
        this.trackProgress();
      });
    }

    return damage;
  }

  trackProgress() {
    if (this.trackerIndex < this.trackers.length) {
      var tracker = this.trackers[this.trackerIndex];
      tracker.track(this.game.tilespace, this, this.tile);
    }
  }

  rollDice(index) {
    // special case for rerolling an existing dice
    if (this.dice[index] instanceof Dice) {
      this.dice[index].roll();
      return;
    }

    let takenSpots = 0;
    for (let i = 0; i < this.dice.length; i++) {
      if (this.dice[i] instanceof Dice) {
        takenSpots++;
      }
    }

    const freeSpots = Config.BOAT_MAX_DAMAGE - this.damage - takenSpots;
    if (freeSpots <= 0) {
      return;
    }

    var dice = new Dice();
    dice.roll();
    this.dice[index] = dice;

    this.filterDice();
  }

  dropDice(index) {
    this.dice.splice(index, 1);
    this.filterDice();
  }

  filterDice() {
    this.dice = this.dice.filter(dice => !!dice);
  }

  highlightRoute() {
    this.tile.isDirty = true;
    this.unhighlightRoute();

    var tiles = this.getCurrentRouteTiles();
    for (var i = 0; i < tiles.length; i++) {
      tiles[i].highlight(this.color);
    }

    this.currentlyHighlightedRoute = tiles;
  }

  unhighlightRoute() {
    if (!this.currentlyHighlightedRoute) {
      return;
    }

    this.tile.unhighlight();
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

        if (isTakingDamage || !current.isNavigable(this.game.course)) {
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
    if (source.actions === undefined) {
      this.actions = [];
    } else {
      this.actions = [...source.actions];
    }
  }

  getFirstClone() {
    if (this.source.constructor === Boat) {
      return this;
    }

    return this.source.getFirstClone();
  }

  speedUp() {
    super.speedUp();
  }

  slowDown() {
    super.slowDown();
  }

  turnLeft() {
    super.turnLeft();
  }

  turnRight() {
    super.turnRight();
  }

  goStraight() {
    super.goStraight();
  }
}


if (typeof module !== "undefined" && !!module) {
  module.exports = Boat;
}