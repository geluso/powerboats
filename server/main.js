var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();
var http = require('http').Server(app);

app.use(cors());

app.use(express.json());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

const gamesRouter = require('./games/router.js');
app.use('/games', gamesRouter);

const port = process.env.PORT || 3000;
const server = http.listen(port);
module.exports = server;

console.log('http://localhost:' + port + '/games/');