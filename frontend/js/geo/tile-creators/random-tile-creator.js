const Tile = require('../../tile')

class RandomTileCreator {
  constructor() {

  }

  create(row, col, xx, yy, zz) {
    let choice = Math.random();
    let threshold = 1 / 40;
    let tile;

    if (choice < threshold) {
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