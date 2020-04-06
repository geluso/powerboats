require('../frontend/thirdjs/seedrandom');
Math.seedrandom("powerboats!!!!!!!!!!!!!!!!!!!!")

const express = require('express');
const router = express.Router();

const Config = require('../frontend/js/config');
const TileSpace = require('../frontend/js/geo/tile-space');
const Course = require('../frontend/js/course');
const Game = require('../frontend/js/game');

const Boat = require('../frontend/js/boat');

const RandomTileCreator = require('../frontend/js/geo/tile-creators/random-tile-creator');
const JSONTileCreator = require('../frontend/js/geo/tile-creators/json-tile-creator');

const randomTiles = new RandomTileCreator(1 / 10);
const rows = 25;
const cols = 25;
const tilespace = new TileSpace(rows, cols, randomTiles);

const course = new Course(tilespace);
course.setupBuoys();
course.setupStartLine(course.start, Config.START_DIRECTION);

// create game and place boats
const game = new Game(course);
console.log(game.tilespace.toString());

let currentTile = course.start;
for (let i = 0; i < Config.PLAYER_TYPES.length; i++) {
  const color = Config.COLORS[i];
  const playerType = Config.PLAYER_TYPES[i];
  const boat = new Boat(game, color, currentTile, playerType, Config.START_DIRECTION);
  game.boats.push(boat);
  boat.faceBuoy();

  currentTile = course.tilespace.nextTileInDirection(currentTile, course.startDirection);
}

const GAMES = {
  'budweiser': { ace: 99 },
  'rainier': game,
};

router.route('/')
  .get((req, res) => {
    res.send(GAMES)
  })
  .post((req, res) => {
    console.log(req.params);
    res.send(200)
  });

router.route('/:name')
  .get((req, res) => {
    const name = req.params.name;
    const game = GAMES[name];
    const json = { game: game.toJSON() };
    res.send(json);
  });

router.put('/:name', (req, res) => {
  const name = req.params.name;
  const { color, action, direction } = req.body;
  const game = GAMES[name];

  const player = game.getPlayer(color);
  player.direction = direction;
  if (action === 'goStraight') {
    player.goStraight();
  } else if (action === 'speedUp') {
    player.speedUp();
  } else if (action === 'slowDown') {
    player.slowDown();
  } else if (action === 'turnLeft') {
    player.turnLeft();
  } else if (action === 'turnRight') {
    player.turnRight();
  }

  const json = {
    game: { boats: [player.toJSON()] }
  };
  res.send(json);
});

module.exports = router;
