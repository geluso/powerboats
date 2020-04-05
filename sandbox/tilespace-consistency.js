const Resources = require('../frontend/js/resources');
const TileSpace = require('../frontend/js/geo/tile-space');
const RandomTileCreator = require('../frontend/js/geo/tile-creators/random-tile-creator');

require('../frontend/thirdjs/seedrandom');
Math.seedrandom("powerboats!!!!!!!!!!!!!!!!!!!!");

const creator = new RandomTileCreator();
const t1 = new TileSpace(10, 10, creator);
console.log(t1.toString());

const json = t1.toJSON();
const t2 = TileSpace.fromJSON(json);
console.log(t2.toString());