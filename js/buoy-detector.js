class BuoyDetector {
  constructor(buoy) {
    this.buoy = buoy;
    this.crossDirection = {};
    this.approachPath = [];

    for (var i = 0; i < Directions.possibleDirections.length; i++) {
      var direction = Directions.possibleDirections[i];
      this.crossDirection[direction] = false;
    }

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

  track(tile) {
    if (!this.north) {
      this.initDirections();
    }

    function tileDistance(t1, t2) {
      var dx = t1.xIndex - t2.xIndex;
      var dy = t1.yIndex - t2.yIndex;
      var dz = t1.zIndex - t2.zIndex;
      var distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
      return distance;
    }

    if (tile.xIndex === this.buoy.tile.xIndex) {
      if (tileDistance(tile, this.north) < tileDistance(tile, this.south)) {
        this.crossDirection["north"] = true;
        this.approachPath.push("north");
      } else {
        this.crossDirection["south"] = true;
        this.approachPath.push("south");
      }

      tile.isDirty = true;
    }

    if (tile.yIndex === this.buoy.tile.yIndex) {
      if (tileDistance(tile, this.northEast) < tileDistance(tile, this.southWest)) {
        this.crossDirection["north-east"] = true;
        this.approachPath.push("north-east");
      } else {
        this.crossDirection["south-west"] = true;
        this.approachPath.push("south-west");
      }

      tile.isDirty = true;
    }

    if (tile.zIndex === this.buoy.tile.zIndex) {
      if (tileDistance(tile, this.northWest) < tileDistance(tile, this.southEast)) {
        this.crossDirection["north-west"] = true;
        this.approachPath.push("north-west");
      } else {
        this.crossDirection["south-east"] = true;
        this.approachPath.push("south-east");
      }

      tile.isDirty = true;
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

