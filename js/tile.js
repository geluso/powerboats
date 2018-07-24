var SIDES = 6;
var TILE_SIZE, EDGE_LENGTH, HALF_EDGE, TILE_HEIGHT;

SetTileSize(50);

function SetTileSize(size) {
  TILE_SIZE = size;
  EDGE_LENGTH = TILE_SIZE;
  HALF_EDGE = EDGE_LENGTH / 2;
  TILE_HEIGHT = Math.sqrt(3) / 2 * HALF_EDGE;
}

function Tile(x, y, resource, buoy) {
  this.resource = resource;
  this.buoy = buoy;
  this.hover = false;
  this.isGivingDamage = false;
  this.isDirty = true;

  this.x = x;
  this.y = y;

  this.shape = new Hexagon(x, y, TILE_SIZE);
}

Tile.prototype.highlight = function() {
  this.hover = true;
  this.isDirty = true;
}

Tile.prototype.unhighlight = function() {
  this.hover = false;
  this.isGivingDamage = false;
  this.isDirty = true;
}

Tile.prototype.givingDamage = function() {
  this.isGivingDamage = true;
  this.isDirty = true;
}

Tile.prototype.setX = function(x) {
  this.x = x;
  this.shape.x = x;
};

Tile.prototype.setY = function(y) {
  this.y = y;
  this.shape.y = y;
};

Tile.prototype.setXY = function(x, y) {
  this.setX(x);
  this.setY(y);
};

Tile.prototype.keyObject = function() {
  var key = {x: this.xIndex, y: this.yIndex, z: this.zIndex};
  return key;
};

Tile.prototype.key = function() {
  var key = [this.xIndex, this.yIndex, this.zIndex];
  key = key.join(",");
  return key;
};

Tile.prototype.keyObjectToKey = function(keyObject) {
  var key = [keyObject.x, keyObject.y, keyObject.z];
  key = key.join(",");
  return key;
};

Tile.prototype.north = function() {
  var key = this.keyObject();
  key.y++;
  key.z--;
  return this.keyObjectToKey(key);
};

Tile.prototype.south = function() {
  var key = this.keyObject();
  key.y--;
  key.z++;
  return this.keyObjectToKey(key);
};

Tile.prototype.northEast = function() {
  var key = this.keyObject();
  key.x++;
  key.z--;
  return this.keyObjectToKey(key);
};

Tile.prototype.southEast = function() {
  var key = this.keyObject();
  key.x++;
  key.y--;
  return this.keyObjectToKey(key);
};

Tile.prototype.northWest = function() {
  var key = this.keyObject();
  key.x--;
  key.y++;
  return this.keyObjectToKey(key);
};

Tile.prototype.southWest = function() {
  var key = this.keyObject();
  key.x--;
  key.z++;
  return this.keyObjectToKey(key);
};

Tile.prototype.cycleTile = function() {
  if (this.resource.color === "yellow") {
    this.resource = {color: "red"};
  } else if (this.resource.color === "red") {
    this.resource = {color: "green"};
  } else {
    this.resource = {color: "yellow"};
  }
}

function TileGenerator() {
  this.waterTile = function(x, y) {
    var resource = WATER;
    var tile = new Tile(x, y, resource);
    return tile;
  };

  this.landTile = function(x, y) {
    var resource = LAND;
    var tile = new Tile(x, y, resource);
    return tile;
  };
}

