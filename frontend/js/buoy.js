const Tile = require('./tile')

class Buoy {
  constructor(turnNumber, tile) {
    this.turnNumber = turnNumber;
    this.tile = tile;
  }

  static fromJSON(json) {
    let { turnNumber, tile } = json;
    tile = Tile.fromJSON(tile);
    const buoy = new Buoy(turnNumber, tile);
    return buoy;
  }

  toJSON() {
    const json = {
      turnNumber: this.turnNumber,
      tile: this.tile.toJSON()
    };
    return json;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = Buoy;
}