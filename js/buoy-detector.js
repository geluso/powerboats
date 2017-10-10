class BuoyDetector {
  constructor(buoy) {
    this.buoy = buoy;
    this.crossDirection = {};
    this.approachPath = [];

    for (var i = 0; i < Directions.possibleDirections.length; i++) {
      var direction = Directions.possibleDirections[i];
      this.crossDirection[direction] = false;
    }
  }

  track(tile) {
    if (tile.x === this.buoy.tile.x) {
      this.crossDirection["north"] = true;
      this.approachPath.push("north");
      this.crossDirection["south"] = true;
      this.approachPath.push("south");

      tile.isDirty = true;
    }
  }

  draw(ctx) {
    var center = this.buoy.tile;

    var north = BOARD.tilespace.getByKey(center.north());
    var northWest = BOARD.tilespace.getByKey(center.northWest());
    var northEast = BOARD.tilespace.getByKey(center.northEast());

    var south = BOARD.tilespace.getByKey(center.south());
    var southWest = BOARD.tilespace.getByKey(center.southWest());
    var southEast = BOARD.tilespace.getByKey(center.southEast());

    Point.draw(ctx, north, this.getDirectionStatus("north"));
    Point.draw(ctx, northWest, this.getDirectionStatus());
    Point.draw(ctx, northEast, this.getDirectionStatus());

    Point.draw(ctx, south, this.getDirectionStatus("south"));
    Point.draw(ctx, southWest, this.getDirectionStatus());
    Point.draw(ctx, southEast, this.getDirectionStatus());
  }

  getDirectionStatus(direction) {
    if (this.crossDirection[direction]) {
      return "green";
    }

    return "orange";
  }
}

