const Tile = require('../tile')
const _ = require('lodash')

function TileSpace() {
  this.keyedTiles = {};
  this.tiles = [];

  // a list of all tiles, corners, and edges
  this.everything = [];
}

TileSpace.prototype.init = function (width, height) {
  this.width = width;
  this.height = height;

  var biggerOne = width;
  var smallerOne = height;

  var tiles = 30;
  if (height > width) {
    biggerOne = height;
    smallerOne = width;
    tiles = 60;
  }

  TILE_HEIGHT = height / tiles / 4;
  HALF_EDGE = TILE_HEIGHT / (Math.sqrt(3) / 2);
  EDGE_LENGTH = HALF_EDGE * 2;
  TILE_SIZE = EDGE_LENGTH;
  Tile.SetTileSize(TILE_SIZE);

  // this number was simply measured and estimated
  // to see how many more cols needed to fill the
  // screen.
  var magicRowToColScale = 1.15;

  this.rows = tiles;
  this.cols = this.rows * (width / height) * magicRowToColScale;

  this.createHexagons();
  this.centerTiles();

  return this;
};

TileSpace.prototype.curateBoard = function () {
  // make a list containing every tile, corner and edge on the board.
  this.everything = _.union(this.tiles, this.edges);
};

TileSpace.prototype.createHexagons = function () {
  var tileGen = new Tile.TileGenerator();
  var maxRows = this.rows + 1;

  var yIndex = 0;
  var xIndex = 0;
  var zIndex = 0;
  for (var row = 0; row < maxRows; row++) {
    xIndex = 0;
    yIndex = -row;
    zIndex = row;
    for (var col = 0; col < this.cols; col++) {
      var xOff = TILE_SIZE * 1.5;
      var yOff = TILE_SIZE * 1.72;

      var x = xOff * col;
      var y = yOff * row;

      var direction = "up-right";
      if (col % 2 === 1) {
        y += TILE_SIZE * 0.86;
        direction = "down-right";
      }

      if (direction === "up-right") {
        xIndex++;
        zIndex--;
      } else if (direction === "down-right") {
        xIndex++;
        yIndex--;
      }

      x = Math.floor(x);
      y = Math.floor(y);

      var landBorder = 3;
      var tile;
      if (row < landBorder - 1 || col < landBorder ||
        row > maxRows - landBorder ||
        col > this.cols - landBorder) {
        tile = tileGen.landTile(x, y);
      } else {
        var choice = Math.random();
        var threshold = 1 / 40;
        if (choice < threshold) {
          tile = tileGen.landTile(x, y);
        } else {
          tile = tileGen.waterTile(x, y);
        }
      }

      tile.xIndex = xIndex;
      tile.yIndex = yIndex;
      tile.zIndex = zIndex;

      this.keyedTiles[tile.key()] = tile;

      tile.row = row;
      tile.col = col;

      this.tiles.push(tile);
    }
  }
};

var CENTER;

// find the centermost tile and schooch all tiles so they're
// centered in the screen.
TileSpace.prototype.centerTiles = function () {
  // target the center of the screen.
  var target = { x: this.width / 2, y: this.height / 2 };

  var bestDiff;
  var bestTile;

  // compare each tile to the ideal target point to find the closest center tile.
  _.each(this.tiles, (tile) => {
    var diff = Math.abs(tile.x - target.x) + Math.abs(tile.y - target.y);
    if (bestTile === undefined || diff < bestDiff) {
      bestDiff = diff;
      bestTile = tile;
    }
  });

  // declare the best fit tile as the center tile.
  this.centerTile = bestTile;
  CENTER = this.centerTile;

  // measure the distance between the center of the screen and the center tile.
  var xOffset = target.x - (this.centerTile.x);
  var yOffset = target.y - (this.centerTile.y);

  // move all tiles according to the center measured distance
  _.each(this.tiles, (tile) => {
    tile.setX(tile.x + xOffset);
    tile.setY(tile.y + yOffset);
  });
};

TileSpace.prototype.centerOnHexCenter = function () {
  // this is default layout
};

TileSpace.prototype.centerOnHexEdges = function () {
  var xOffset = TILE_HEIGHT + EDGE_LENGTH;

  // move all tiles according to the center measured distance
  _.each(this.tiles, (tile) => {
    tile.setX(tile.x - xOffset);
  });
};

TileSpace.prototype.getByKey = function (key) {
  var tile = this.keyedTiles[key];
  if (!tile) {
    return this.keyedTiles["1,0,-1"];
  }
  return tile;
};

TileSpace.prototype.nextTileInDirection = function (tile, direction) {
  if (!tile) {
    return;
  }

  var nextKey;
  if (direction === "north") {
    nextKey = tile.north();
  } else if (direction === "north-east") {
    nextKey = tile.northEast();
  } else if (direction === "north-west") {
    nextKey = tile.northWest();
  } else if (direction === "south") {
    nextKey = tile.south();
  } else if (direction === "south-east") {
    nextKey = tile.southEast();
  } else if (direction === "south-west") {
    nextKey = tile.southWest();
  }

  var nextTile = this.getByKey(nextKey);
  return nextTile;
};

if (typeof module !== "undefined" && !!module) {
  module.exports = TileSpace;
}