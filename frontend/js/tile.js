const Resources = require('./resources');
const Hexagon = require('./geo/hexagon')

var SIDES = 6;
var TILE_SIZE, EDGE_LENGTH, HALF_EDGE, TILE_HEIGHT;

SetTileSize(50);

function SetTileSize(size) {
  TILE_SIZE = size;
  EDGE_LENGTH = TILE_SIZE;
  HALF_EDGE = EDGE_LENGTH / 2;
  TILE_HEIGHT = Math.sqrt(3) / 2 * HALF_EDGE;
}

Tile.SetTileSize = SetTileSize

function Tile(xIndex, yIndex, zIndex, resource, buoy) {
  this.resource = resource;
  this.buoy = buoy;
  this.hover = false;
  this.isGivingDamage = false;
  this.isDirty = true;

  this.xIndex = xIndex;
  this.yIndex = yIndex;
  this.zIndex = zIndex;
}

Tile.prototype.toJSON = function () {
  return {
    resource: this.resource,
    pixelX: this.x,
    pixelY: this.y,

    xIndex: this.xIndex,
    yIndex: this.yIndex,
    zIndex: this.zIndex,

    row: this.row,
    col: this.col
  }
}

Tile.prototype.highlight = function () {
  this.hover = true;
  this.isDirty = true;
}

Tile.prototype.unhighlight = function () {
  this.hover = false;
  this.isGivingDamage = false;
  this.isDirty = true;
}

Tile.prototype.givingDamage = function () {
  this.isGivingDamage = true;
  this.isDirty = true;
}

Tile.prototype.setX = function (x) {
  this.x = x;
  this.shape.x = x;
};

Tile.prototype.setY = function (y) {
  this.y = y;
  this.shape.y = y;
};

Tile.prototype.setXY = function (x, y) {
  this.setX(x);
  this.setY(y);
};

Tile.prototype.keyObject = function () {
  var key = { x: this.xIndex, y: this.yIndex, z: this.zIndex };
  return key;
};

Tile.prototype.key = function () {
  var key = [this.xIndex, this.yIndex, this.zIndex];
  key = key.join(",");
  return key;
};

Tile.prototype.keyObjectToKey = function (keyObject) {
  var key = [keyObject.x, keyObject.y, keyObject.z];
  key = key.join(",");
  return key;
};

Tile.prototype.north = function () {
  var key = this.keyObject();
  key.y++;
  key.z--;
  return this.keyObjectToKey(key);
};

Tile.prototype.south = function () {
  var key = this.keyObject();
  key.y--;
  key.z++;
  return this.keyObjectToKey(key);
};

Tile.prototype.northEast = function () {
  var key = this.keyObject();
  key.x++;
  key.z--;
  return this.keyObjectToKey(key);
};

Tile.prototype.southEast = function () {
  var key = this.keyObject();
  key.x++;
  key.y--;
  return this.keyObjectToKey(key);
};

Tile.prototype.northWest = function () {
  var key = this.keyObject();
  key.x--;
  key.y++;
  return this.keyObjectToKey(key);
};

Tile.prototype.southWest = function () {
  var key = this.keyObject();
  key.x--;
  key.z++;
  return this.keyObjectToKey(key);
};

function TileGenerator() {
  this.waterTile = function (xIndex, yIndex, zIndex) {
    var resource = Resources.WATER;
    var tile = new Tile(xIndex, yIndex, zIndex, resource);
    return tile;
  };

  this.landTile = function (xIndex, yIndex, zIndex) {
    var resource = Resources.LAND;
    var tile = new Tile(xIndex, yIndex, zIndex, resource);
    return tile;
  };
}

Tile.TileGenerator = TileGenerator;

if (typeof module !== "undefined" && !!module) {
  module.exports = Tile;
}