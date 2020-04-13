const GameSocket = require('./game-socket');

class ServerSockets {
  constructor(io, serverGames) {
    this.io = io;
    this.serverGames = serverGames;

    io.on('connection', socket => {
      const url = socket.handshake.headers.referer;
      const gameName = url.split('game=')[1];
      console.log('new connection', gameName);
      new GameSocket(io, socket, serverGames, gameName);
    });
  }
}

module.exports = ServerSockets;