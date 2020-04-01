class FinishLineDetector {
  constructor() {
    this.finishLineTiles = [];
    this.pointsActivated = 0;
  }

  add(tile) {
    this.finishLineTiles.push(tile);
    if (this.finishLineTiles.length === 1) {
      this.tile = tile;
    }
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
        this.pointsActivated++;
      }
    }
  }

  draw(ctx) {
  }

  clone() {
    var finish = new FinishLineDetector();
    for (var i = 0; i < this.finishLineTiles.length; i++) {
      finish.add(this.finishLineTiles[i]);
    }

    return finish;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = FinishLineDetector;
}