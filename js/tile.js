var SIDES = 6;
var TILE_SIZE, EDGE_LENGTH, HALF_EDGE, TILE_HEIGHT;

SetTileSize(50);

function SetTileSize(size) {
  TILE_SIZE = size;
  EDGE_LENGTH = TILE_SIZE;
  HALF_EDGE = EDGE_LENGTH / 2;
  TILE_HEIGHT = Math.sqrt(3) / 2 * HALF_EDGE;
}

function Tile(x, y, resource, token) {
  this.resource = resource;
  this.token = token;
  this.hover = false;

  this.x = x;
  this.y = y;

  this.shape = new Hexagon(x, y, TILE_SIZE);
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

function TileGenerator() {
  var resources = new ResourceGenerator();
  var tokens = new TokenGenerator(2, 12);

  this.randomTile = function(x, y) {
    var resource = resources.randomResource(); 

    var token;
    if (resource !== DESERT) {
      token = tokens.randomToken();
    }

    var tile = new Tile(x, y, resource, token);
    return tile;
  };

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

