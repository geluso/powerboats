const Directions = require('./geo/directions');

class BuoyTracker {
  constructor(buoy) {
    this.buoy = buoy;
    this.crossDirection = {};
    this.approachPath = [];
    this.pointsActivated = 0;

    this.registerAllDirections(false);
  }

  static fromJSON(game, json) {
    const buoyIndex = json.buoy.turnNumber - 1;
    const buoy = game.course.buoys[buoyIndex];

    const tracker = new BuoyTracker(buoy);
    tracker.updateFromJSON(json);
    return tracker;
  }

  updateFromJSON(json) {
    this.crossDirection = json.crossDirection;
    this.approachPath = json.approachPath;
    this.pointsActivated = json.pointsActivated;
  }

  toJSON() {
    const json = {
      buoy: this.buoy.toJSON(),
      crossDirection: this.crossDirection,
      approachPath: this.approachPath,
      pointsActivated: this.pointsActivated,
    };
    return json;
  }

  initDirections(tilespace) {
    const center = this.buoy.tile;
    this.north = tilespace.getByKey(center.north());
    this.northWest = tilespace.getByKey(center.northWest());
    this.northEast = tilespace.getByKey(center.northEast());

    this.south = tilespace.getByKey(center.south());
    this.southWest = tilespace.getByKey(center.southWest());
    this.southEast = tilespace.getByKey(center.southEast());
  }

  track(tilespace, boat, tile) {
    if (!this.north) {
      this.initDirections(tilespace);
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

  getDirectionStatus(direction, boatColor) {
    if (this.crossDirection[direction]) {
      return "lawngreen";
    }
    return boatColor;
  }

  clone() {
    var clone = new BuoyTracker(this.buoy, this.tilespace);

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
  module.exports = BuoyTracker;
}