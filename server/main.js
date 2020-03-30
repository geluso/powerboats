var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var http = require('http').Server(app);

// decode POST data in JSON and URL encoded formats
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const ThreeBuoyBoard = require('../frontend/js/boards/three-buoy-board');
const TileSpace = require('../frontend/js/geo/tile-space');
const Game = require('../frontend/js/game');

// manually adjusted for browser.
// TODO: make tilespace independent of resolution
console.log('creating tilespace and board')
const width = 1440;
const height = 766;
const space = new TileSpace().init(width, height);
const board = new ThreeBuoyBoard();
board.init(space);

// hanky hacks
space.curateBoard();
board.registerTileSpace(space);

console.log('board', board)
const game = new Game(board);
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
  const json = game.toJSON();
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