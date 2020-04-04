const Resources = require('./resources');

class Tile {
  constructor(row, col, xIndex, yIndex, zIndex, resource) {
    this.row = row;
    this.col = col;

    this.xIndex = xIndex;
    this.yIndex = yIndex;
    this.zIndex = zIndex;
    this.resource = resource;

    this.buoy = null;
    this.hover = false;
    this.isGivingDamage = false;
    this.isDirty = true;
  }

  static fromJSON(json) {
    const { row, col, xIndex, yIndex, zIndex } = json;
    const resource = Resources.resourceFromString(json.resourceName);

    const tile = new Tile(row, col, xIndex, yIndex, zIndex, resource);
    return tile;
  }

  toJSON() {
    return {
      resourceName: this.resource.name,

      xIndex: this.xIndex,
      yIndex: this.yIndex,
      zIndex: this.zIndex,

      row: this.row,
      col: this.col
    }
  }


  static setTileSize(size) {
    Tile.TILE_SIZE = size;
    Tile.EDGE_LENGTH = Tile.TILE_SIZE;
    Tile.HALF_EDGE = Tile.EDGE_LENGTH / 2;
    Tile.TILE_HEIGHT = Math.sqrt(3) / 2 * Tile.HALF_EDGE;
  }

  static createWaterTile = function (row, col, xIndex, yIndex, zIndex) {
    var resource = Resources.WATER;
    var tile = new Tile(row, col, xIndex, yIndex, zIndex, resource);
    return tile;
  }

  static createLandTile = function (row, col, xIndex, yIndex, zIndex) {
    var resource = Resources.LAND;
    var tile = new Tile(row, col, xIndex, yIndex, zIndex, resource);
    return tile;
  }

  highlight() {
    this.hover = true;
    this.isDirty = true;
  }

  unhighlight() {
    this.hover = false;
    this.isGivingDamage = false;
    this.isDirty = true;
  }

  givingDamage() {
    this.isGivingDamage = true;
    this.isDirty = true;
  }

  setX(x) {
    this.x = x;
    this.shape.x = x;
  };

  setY(y) {
    this.y = y;
    this.shape.y = y;
  };

  setXY(x, y) {
    this.setX(x);
    this.setY(y);
  };

  keyObject() {
    var key = { x: this.xIndex, y: this.yIndex, z: this.zIndex };
    return key;
  };

  key() {
    var key = [this.xIndex, this.yIndex, this.zIndex];
    key = key.join(",");
    return key;
  };

  keyObjectToKey(keyObject) {
    var key = [keyObject.x, keyObject.y, keyObject.z];
    key = key.join(",");
    return key;
  };

  north() {
    var key = this.keyObject();
    key.y++;
    key.z--;
    return this.keyObjectToKey(key);
  };

  south() {
    var key = this.keyObject();
    key.y--;
    key.z++;
    return this.keyObjectToKey(key);
  };

  northEast() {
    var key = this.keyObject();
    key.x++;
    key.z--;
    return this.keyObjectToKey(key);
  };

  southEast() {
    var key = this.keyObject();
    key.x++;
    key.y--;
    return this.keyObjectToKey(key);
  };

  northWest() {
    var key = this.keyObject();
    key.x--;
    key.y++;
    return this.keyObjectToKey(key);
  };

  southWest() {
    var key = this.keyObject();
    key.x--;
    key.z++;
    return this.keyObjectToKey(key);
  };
}

Tile.setTileSize(50);

if (typeof module !== "undefined" && !!module) {
  module.exports = Tile;
}