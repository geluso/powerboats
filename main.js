var express = require('express');
var app = express();
var http = require('http').Server(app);
const io = require('socket.io')(http);


var cors = require('cors');
app.use(cors());

app.use(express.json());

// Let Parcel handle requests
const Bundler = require('parcel-bundler');
const bundler = new Bundler('frontend/index.html');
app.use(bundler.middleware());

const ServerGame = require('./games/server-game');
new ServerGame(io, 'rainier');
new ServerGame(io, 'pbr');

const port = process.env.PORT || 3000;
const server = http.listen(port);
module.exports = server;

console.log('http://localhost:' + port + '/games/');