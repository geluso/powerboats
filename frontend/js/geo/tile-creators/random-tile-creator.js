const Tile = require('../../tile')

class RandomTileCreator {
  // default: 1 tile of land for every 40 tiles of water
  constructor(landToWaterRatio = 1 / 40) {
    this.ratio = landToWaterRatio;
  }

  create(row, col, xx, yy, zz) {
    let choice = Math.random();
    let tile;

    if (choice < this.ratio) {
      tile = Tile.createLandTile(row, col, xx, yy, zz);
    } else {
      tile = Tile.createWaterTile(row, col, xx, yy, zz);
    }

    return tile;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = RandomTileCreator;
}