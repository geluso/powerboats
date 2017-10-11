class BuoyDetector {
  constructor(buoy) {
    this.buoy = buoy;
    this.crossDirection = {};
    this.approachPath = [];
    this.pointsActivated = 0;

    this.registerAllDirections(false);

    this.center = this.buoy.tile;
  }

  initDirections() {
    this.north = BOARD.tilespace.getByKey(this.center.north());
    this.northWest = BOARD.tilespace.getByKey(this.center.northWest());
    this.northEast = BOARD.tilespace.getByKey(this.center.northEast());

    this.south = BOARD.tilespace.getByKey(this.center.south());
    this.southWest = BOARD.tilespace.getByKey(this.center.southWest());
    this.southEast = BOARD.tilespace.getByKey(this.center.southEast());
  }

  track(boat, tile) {
    function tileDistance(t1, t2) {
      var dx = t1.xIndex - t2.xIndex;
      var dy = t1.yIndex - t2.yIndex;
      var dz = t1.zIndex - t2.zIndex;
      var distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
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
      return "green";
    }

    return "orange";
  }
}

