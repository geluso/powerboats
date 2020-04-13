const ServerGame = require('./server-game');

class ServerGames {
  constructor(io) {
    this.io = io
    this.games = {};
  }

  contains(name) {
    return !!this.games[name];
  }

  createGame(name) {
    const game = new ServerGame(this.io, name);
    this.games[name] = game;
  }
}

module.exports = ServerGames;