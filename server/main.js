require('../frontend/thirdjs/seedrandom');
Math.seedrandom("powerboats!!!!!!!!!!!!!")
console.log(Math.random());
console.log(Math.random());
console.log(Math.random());

var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
var http = require('http').Server(app);

app.use(cors());

// decode POST data in JSON and URL encoded formats
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const Config = require('../frontend/js/config');
const TileSpace = require('../frontend/js/geo/tile-space');
const Course = require('../frontend/js/course');
const Game = require('../frontend/js/game');

const Boat = require('../frontend/js/boat');

const RandomTileCreator = require('../frontend/js/geo/tile-creators/random-tile-creator');
const JSONTileCreator = require('../frontend/js/geo/tile-creators/json-tile-creator');

// manually adjusted for browser.
// TODO: make tilespace independent of resolution
console.log('creating tilespace and board')
const randomTiles = new RandomTileCreator(1 / 10);
const rows = 25;
const cols = 25;
const tilespace = new TileSpace(rows, cols, randomTiles);

const course = new Course(tilespace);
course.setupBuoys();
course.setupStartLine(course.start, Config.START_DIRECTION);

// create game and place boats
const game = new Game(course);
let currentTile = course.start;
for (let i = 0; i < Config.PLAYER_TYPES.length; i++) {
  const color = Config.COLORS[i];
  const playerType = Config.PLAYER_TYPES[i];
  const boat = new Boat(game, color, currentTile, playerType);
  game.boats.push(boat);
  boat.faceBuoy();

  currentTile = course.tilespace.nextTileInDirection(currentTile, course.startDirection);
}

const GAMES = {
  'budweiser': { ace: 99 },
  'rainier': game,
};

app.get('/games/', (req, res) => {
  res.send(GAMES)
})

app.post('/games/create', (req, res) => {
  console.log(req.params);
  res.send(200)
});

app.get('/games/:name', (req, res) => {
  const name = req.params.name;
  const game = GAMES[name];
  const json = { game: game.toJSON() };
  res.send(json);
});

app.get('/games/:name/turn-left', (req, res) => {
  const name = req.params.name;
  const game = GAMES[name];

  const player = game.getCurrentPlayer();
  player.turnLeft();

  const json = { game: game.toJSON() };
  res.send(json);
});

app.get('/games/:name/turn-right', (req, res) => {
  const name = req.params.name;
  const game = GAMES[name];

  const player = game.getCurrentPlayer();
  player.turnRight();

  const json = { game: game.toJSON() };
  res.send(json);
});

app.get('/games/:name/go-straight', (req, res) => {
  const name = req.params.name;
  const game = GAMES[name];

  const player = game.getCurrentPlayer();
  console.log('was', player.color, player.tile.xIndex, player.tile.yIndex, player.tile.zIndex);

  player.goStraight();
  game.endTurn();

  console.log('now', player.color, player.tile.xIndex, player.tile.yIndex, player.tile.zIndex);

  const json = {
    boat: player.toJSON()
  };
  res.send(json);
});

// POST /api/auth - if authenticated, return a signed JWT
app.post('/api/auth', function (req, res) {
  User.findOne({ name: req.body.name }, function (err, user) {
    // return 401 if error or no user
    if (err || !user) return res.status(401).send({ message: 'User not found' });

    // attempt to authenticate a user
    var isAuthenticated = user.authenticated(req.body.password);
    // return 401 if invalid password or error
    if (err || !isAuthenticated) return res.status(401).send({ message: 'User not authenticated' });

    // sign the JWT with the user payload and secret, then return
    var token = jwt.sign(user.toJSON(), secret);

    return res.send({ user: user, token: token });
  });
});


const port = process.env.PORT || 3000;
const server = http.listen(port);
module.exports = server;

console.log('http://localhost:' + port + '/games/');