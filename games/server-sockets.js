const GameSocket = require('./game-socket');

class ServerSockets {
  constructor(io, serverGames) {
    this.io = io;
    this.serverGames = serverGames;

    io.on('connection', socket => {
      console.log('new connection');
      new GameSocket(io, socket, serverGames);
    });
  }
}

module.exports = ServerSockets;