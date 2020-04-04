const _ = require('lodash');

const CONFIG = require('./config');

const Resources = require('./resources');

const Buoy = require('./buoy');
const FinishLineDetector = require('./finish-line-detector');

const NUMBER_OF_BUOYS = 3;

class Course {
  constructor(tilespace) {
    this.tilespace = tilespace;
    this.start = undefined;
    this.startDirection = undefined;
    this.buoys = [];
    this.finishLineDetector = new FinishLineDetector();
  }

  setup() {
    const chooseInsideTile = (tiles, minDistance) => {
      const maxAttempts = 10;
      let attempts = 0;

      while (attempts < maxAttempts) {
        const tile = _.sample(tiles);
        const isWithinVertical = tile.row >= minDistance && tile.row < (this.tilespace.rows - minDistance);
        const isWithinHorizontal = tile.col >= minDistance && tile.col < (this.tilespace.cols - minDistance);
        if (isWithinVertical && isWithinHorizontal) {
          return tile;
        }

        attempts++;

        if (attempts === maxAttempts) {
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
      while (buoysPlaced <= NUMBER_OF_BUOYS) {
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
      tile = this.tilespace.nextTileInDirection(tile, this.startDirection);
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
}

if (typeof module !== "undefined" && !!module) {
  module.exports = Course;
}