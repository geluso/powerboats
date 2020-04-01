const _ = require('lodash');

const CONFIG = require('../config');

const Resources = require('../resources');

const FullscreenBoard = require('./full-screen-board');
const Buoy = require('../buoy');
const FinishLineDetector = require('../finish-line-detector');

function ThreeBuoyBoard() {
  this.type = "Three Buoys";
  this.players = 6;

  this.start = undefined;
  this.startDirection = undefined;
  this.buoys = [];
  this.finishLineDetector = new FinishLineDetector();
}

ThreeBuoyBoard.prototype = new FullscreenBoard();

ThreeBuoyBoard.prototype.init = function (tilespace) {
  // Let the original Board set up itself.
  FullscreenBoard.prototype.init.call(this, tilespace);

  function chooseInsideTile(tiles, minDistance) {
    while (true) {
      const tile = _.sample(tiles);
      const isWithinVertical = tile.row >= minDistance && tile.row < (tilespace.rows - minDistance);
      const isWithinHorizontal = tile.col >= minDistance && tile.col < (tilespace.cols - minDistance);
      if (isWithinVertical && isWithinHorizontal) {
        return tile;
      }
    }
  }

  var startPos;
  if (false && CONFIG.USE_BUOY_ARRAY) {
    startPos = CONFIG.START_POSITION;
    for (var i = 0; i < CONFIG.BUOYS.length; i++) {
      var buoyKey = CONFIG.BUOYS[i];
      var tile = this.tilespace.getByKey(buoyKey);
      var buoy = new Buoy(i + 1, tile);
      this.buoys.push(buoy);
      tile.buoy = buoy;
    }
  } else {
    startPos = chooseInsideTile(this.tilespace.tiles, 10);
    var buoysPlaced = 1;
    while (buoysPlaced <= this.NUMBER_OF_BUOYS) {
      var tile = chooseInsideTile(this.tilespace.tiles, 5)
      var buoy = new Buoy(buoysPlaced, tile);
      this.buoys.push(buoy);

      tile.buoy = buoy;
      buoysPlaced++;
    }
  }

  this.start = startPos;
  this.startDirection = CONFIG.START_DIRECTION;
  this.start.resource = Resources.START_RED;

  this.finishLineDetector.add(this.start);

  var max = 5;
  var i = 1;
  var tile = this.start;
  while (i <= max) {
    tile = tilespace.nextTileInDirection(tile, this.startDirection);
    this.finishLineDetector.add(tile);

    if (tile.resource) {
      if (i === max) {
        tile.resource = Resources.START_RED;
      } else if (i % 2 === 1) {
        tile.resource = Resources.START_WHITE;
      } else {
        tile.resource = Resources.START_BLACK;
      }
    }
    i++;
  }

  return this;
};

function createFinishLine() {

}

ThreeBuoyBoard.prototype.NUMBER_OF_BUOYS = 3;

if (typeof module !== "undefined" && !!module) {
  module.exports = ThreeBuoyBoard;
}