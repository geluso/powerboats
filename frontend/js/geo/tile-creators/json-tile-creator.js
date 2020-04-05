const Tile = require('../../tile')
const Resources = require('../../resources');

class JSONTileCreator {
  constructor(landTilesJSON) {
    this.landTilesJSON = landTilesJSON;
    this.landTileKeys = new Set();
    landTilesJSON.forEach(tile => {
      const key = this.getKey(tile.row, tile.col);
      this.landTileKeys.add(key);
    });
  }

  getKey(row, col) {
    return row + ',' + col;
  }

  create(row, col, xx, yy, zz) {
    let resource;
    let key = this.getKey(row, col);
    if (this.landTileKeys.has(key)) {
      resource = Resources.LAND;
    } else {
      resource = Resources.WATER;
    }

    let tile = new Tile(row, col, xx, yy, zz, resource);
    return tile;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = JSONTileCreator;
}