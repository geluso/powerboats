var express = require('express');
var app = express();
var http = require('http').Server(app);

var cors = require('cors');
app.use(cors());

app.use(express.static('frontend/release'));
app.use(express.json());

const gamesRouter = require('./games/games-router.js');
app.use('/games', gamesRouter);

const port = process.env.PORT || 3000;
const server = http.listen(port);
module.exports = server;

console.log('http://localhost:' + port + '/games/');