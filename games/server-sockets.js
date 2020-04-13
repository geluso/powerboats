const GameSocket = require('./game-socket');

class ServerSockets {
  constructor(io, serverGame) {
    io.on('connection', socket => {
      const url = socket.handshake.headers.referer;
      const gameName = url.split('game=')[1];
      console.log('new connection', gameName);
      new GameSocket(io, socket, serverGame);
    });
  }
}

module.exports = ServerSockets;