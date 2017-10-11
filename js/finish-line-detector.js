class FinishLineDetector {
  constructor() {
    this.finishLineTiles = [];
  }

  add(tile) {
    this.finishLineTiles.push(tile);
  }

  track(boat, tile) {
    function tilesEqual(t1, t2) {
      var xe = t1.xIndex === t2.xIndex;
      var ye = t1.yIndex === t2.yIndex;
      var ze = t1.zIndex === t2.zIndex;

      var allEqual = xe && ye && ze;
      return allEqual;
    }

    for (var i = 0; i < this.finishLineTiles.length; i++) {
      var finishLineTile = this.finishLineTiles[i];
      if (tilesEqual(tile, finishLineTile)) {
        console.log("WON", boat);
        return;
      }
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
}

