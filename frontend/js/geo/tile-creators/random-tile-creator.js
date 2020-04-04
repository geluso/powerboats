const Tile = require('../../tile')

class RandomTileCreator {
  constructor() {

  }

  create(xx, yy, zz) {
    let choice = Math.random();
    let threshold = 1 / 40;
    let tile;

    if (choice < threshold) {
      tile = Tile.createLandTile(xx, yy, zz);
    } else {
      tile = Tile.createWaterTile(xx, yy, zz);
    }

    return tile;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = RandomTileCreator;
}