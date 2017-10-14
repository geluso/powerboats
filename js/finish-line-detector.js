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
  }

  clone() {
    return new FinishLineDetector();
  }
}

