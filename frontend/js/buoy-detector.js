const Directions = require('./geo/directions');
const Point = require('./geo/point');

class BuoyDetector {
  constructor(boat, buoy, tilespace) {
    this.boat = boat;
    this.buoy = buoy;
    this.tilespace = tilespace;

    this.tile = buoy.tile;
    this.crossDirection = {};
    this.approachPath = [];
    this.pointsActivated = 0;

    this.registerAllDirections(false);

    this.center = this.buoy.tile;
  }

  initDirections() {
    this.north = this.tilespace.getByKey(this.center.north());
    this.northWest = this.tilespace.getByKey(this.center.northWest());
    this.northEast = this.tilespace.getByKey(this.center.northEast());

    this.south = this.tilespace.getByKey(this.center.south());
    this.southWest = this.tilespace.getByKey(this.center.southWest());
    this.southEast = this.tilespace.getByKey(this.center.southEast());
  }

  track(boat, tile) {
    if (!this.north) {
      this.initDirections();
    }

    function tileDistance(t1, t2) {
      var dx = t1.xIndex - t2.xIndex;
      var dy = t1.yIndex - t2.yIndex;
      var dz = t1.zIndex - t2.zIndex;
      var distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      return distance;
    }

    if (tile.xIndex === this.buoy.tile.xIndex) {
      if (tileDistance(tile, this.north) < tileDistance(tile, this.south)) {
        this.registerDirection("north", boat);
      } else {
        this.registerDirection("south", boat);
      }
    }

    if (tile.yIndex === this.buoy.tile.yIndex) {
      if (tileDistance(tile, this.northEast) < tileDistance(tile, this.southWest)) {
        this.registerDirection("north-east", boat);
      } else {
        this.registerDirection("south-west", boat);
      }
    }

    if (tile.zIndex === this.buoy.tile.zIndex) {
      if (tileDistance(tile, this.northWest) < tileDistance(tile, this.southEast)) {
        this.registerDirection("north-west", boat);
      } else {
        this.registerDirection("south-east", boat);
      }
    }
  }

  registerDirection(direction, boat) {
    if (this.approachPath.length > 0) {
      // don't double-count someone double-triggering
      // a spot on the buoy.
      var last = this.approachPath[this.approachPath.length - 1];
      if (direction === last) {
        return;
      }

      // guarantee that someone is making clockwise progress
      var next = Directions.clockwiseNext[last];
      if (direction !== next) {
        return;
      }
    }

    this.crossDirection[direction] = true;
    this.approachPath.push(direction);
    this.pointsActivated++;
    if (this.pointsActivated >= 4) {
      this.registerAllDirections(true);
      boat.targetNextBuoy();
    }
  }

  registerAllDirections(bool) {
    for (var i = 0; i < Directions.possibleDirections.length; i++) {
      var direction = Directions.possibleDirections[i];
      this.crossDirection[direction] = bool;
    }
  }

  draw(ctx) {
    if (!this.north) {
      this.initDirections();
    }

    Point.draw(ctx, this.north, this.getDirectionStatus("north"));
    Point.draw(ctx, this.northWest, this.getDirectionStatus("north-west"));
    Point.draw(ctx, this.northEast, this.getDirectionStatus("north-east"));

    Point.draw(ctx, this.south, this.getDirectionStatus("south"));
    Point.draw(ctx, this.southWest, this.getDirectionStatus("south-west"));
    Point.draw(ctx, this.southEast, this.getDirectionStatus("south-east"));
  }

  getDirectionStatus(direction) {
    if (this.crossDirection[direction]) {
      return "lawngreen";
    }

    return this.boat.color;
  }

  clone(boat) {
    var clone = new BuoyDetector(boat, this.buoy, this.tilespace);

    clone.boat = boat;
    clone.buoy = this.buoy;
    clone.tile = this.buoy.tile;
    clone.pointsActivated = this.pointsActivated;
    clone.center = this.buoy.tile;

    clone.crossDirection = {};
    for (var key in this.crossDirection) {
      clone.crossDirection[key] = this.crossDirection[key];
    }

    clone.approachPath = [];
    for (var i = 0; i < this.approachPath.length; i++) {
      clone.approachPath.push(this.approachPath[i]);
    }

    return clone;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = BuoyDetector;
}