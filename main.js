var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);

var cors = require('cors');
app.use(cors());

app.use(express.json());

// look for new games as they come in.
const ServerGames = require('./games/server-games');
const games = new ServerGames(io);
app.use((req, res, next) => {
  const gameName = req.query.game;
  if (!games.contains(gameName)) {
    games.createGame(gameName);
  }
  next();
});

// Let Parcel handle requests
const Bundler = require('parcel-bundler');
const bundler = new Bundler('frontend/index.html');
app.use(bundler.middleware());

const port = process.env.PORT || 3000;
const server = http.listen(port);
module.exports = server;

console.log('http://localhost:' + port + '/games/');