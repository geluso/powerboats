const Tile = require('../../tile')
const Resources = require('../../resources');

class JSONTileCreator {
  constructor(landTilesJSON) {
    this.landTilesJSON = landTilesJSON;
  }

  create(row, col, xx, yy, zz) {
    let resource;
    if (this.isLand(row, col, xx, yy, zz)) {
      resource = Resources.LAND;
    } else {
      resource = Resources.WATER;
    }

    let tile = new Tile(row, col, xx, yy, zz, resource);
    return tile;
  }

  isLand(row, col, xx, yy, zz) {
    return Math.random() < 1 / 10;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = JSONTileCreator;
}