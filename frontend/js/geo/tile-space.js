const Tile = require('../tile')
const _ = require('lodash')

var CENTER;

class TileSpace {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;

    this.keyedTiles = {};
    this.keyedTilesRowCol = {};

    this.tiles = [];

    this.createHexagons();
  }

  fromJSON() {
  }

  toJSON() {
    const json = {
      rows: this.row,
      cols: this.cols,
      tiles: this.tiles.map(tile => tile.toJSON())
    }
    return JSON.stringify(json);
  }

  createHexagons() {
    var maxRows = this.rows + 1;

    var yIndex = 0;
    var xIndex = 0;
    var zIndex = 0;
    for (var row = 0; row < maxRows; row++) {
      xIndex = 0;
      yIndex = -row;
      zIndex = row;
      for (var col = 0; col < this.cols; col++) {
        var direction = "up-right";
        if (col % 2 === 1) {
          direction = "down-right";
        }

        if (direction === "up-right") {
          xIndex++;
          zIndex--;
        } else if (direction === "down-right") {
          xIndex++;
          yIndex--;
        }

        var landBorder = 2;
        var tile;
        if (row < landBorder - 1 || col < landBorder ||
          row > maxRows - landBorder ||
          col > this.cols - landBorder) {
          tile = Tile.createLandTile(xIndex, yIndex, zIndex);
        } else {
          var choice = Math.random();
          var threshold = 1 / 40;
          if (choice < threshold) {
            tile = Tile.createLandTile(xIndex, yIndex, zIndex);
          } else {
            tile = Tile.createWaterTile(xIndex, yIndex, zIndex);
          }
        }

        tile.xIndex = xIndex;
        tile.yIndex = yIndex;
        tile.zIndex = zIndex;

        this.keyedTiles[tile.key()] = tile;
        this.keyedTilesRowCol[row + ',' + col] = tile;

        tile.row = row;
        tile.col = col;

        this.tiles.push(tile);
      }
    }
  }

  // find the centermost tile and schooch all tiles so they're
  // centered in the screen.
  centerTiles() {
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

  centerOnHexCenter() {
    // this is default layout
  };

  centerOnHexEdges() {
    var xOffset = TILE_HEIGHT + EDGE_LENGTH;

    // move all tiles according to the center measured distance
    _.each(this.tiles, (tile) => {
      tile.setX(tile.x - xOffset);
    });
  };

  getByKey(key) {
    var tile = this.keyedTiles[key];
    if (!tile) {
      return this.keyedTiles["1,0,-1"];
    }
    return tile;
  };

  getByKeyRowCol(row, col) {
    const key = row + ',' + col;
    return this.keyedTilesRowCol[key];
  }

  nextTileInDirection(tile, direction) {
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
  }

  getTile(x, y) {
    var tile;

    for (var i = 0; i < this.tiles.length; i++) {
      var xx = Math.abs(this.tiles[i].x - x);
      var yy = Math.abs(this.tiles[i].y - y);
      if (xx < Tile.TILE_SIZE && yy < Tile.TILE_SIZE) {
        tile = this.tiles[i];
      }
    }

    return tile;
  }

}

if (typeof module !== "undefined" && !!module) {
  module.exports = TileSpace;
}