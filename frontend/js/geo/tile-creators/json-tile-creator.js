const Tile = require('../../tile')
const Resources = require('../../resources');

class JSONTileCreator {
  constructor(json) {
    this.json = json;
  }

  create(xx, yy, zz) {
    let tile = new Tile(xx, yy, zz);
    if (this.isLand(xx, yy, zz)) {
      tile.resource = Resources.LAND;
    } else {
      tile.resource = Resources.WATER;
    }
    return tile;
  }

  isLand(xx, yy, zz) {
    return Math.random() < .5;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = JSONTileCreator;
}