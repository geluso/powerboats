// io.on('connection', function(socket) {
//   console.log('a user connected');

//   // to everyone;
//   io.emit('new-connection', {});

//   // to everyone except for this socket
//   socket.broadcast.emit('hello!');

//   // specific event
//   socket.on('action', (data) => {

//   });

//   // specific event
//   socket.on('chat', (data) => {
//     console.log('chat', data);
//   });

//   // automatic disconnect
//   socket.on('disconnect', function () {
//     console.log('user disconnected');
//   });
class GameSocket {
  constructor(io, socket, serverGames) {
    this.io = io;
    this.socket = socket;
    this.serverGames = serverGames;

    socket.emit('new-map', { game: serverGames.getGame('rainier').toJSON() });
    socket.emit('load-all-chat', { chat: serverGames.getChat('rainier') });

    socket.on('chat', this.handleChat);
    socket.on('action', this.handleAction);
    socket.on('disconnect', this.handleDisconnect);
  }

  handleChat = message => {
    const chat = this.serverGames.handleChat(message);
    this.io.emit('receive-chat', chat);
  }

  handleAction = message => {
    console.log('handle action', message);

    if (message.action === 'newMap') {
      const game = this.serverGames.newMap(message.gameName);
      this.io.emit('new-map', { game: game });
    } else {
      const updatedPlayer = this.serverGames.handleAction(message);
      this.io.emit('update-player', { player: updatedPlayer });
    }
  }

  handleDisconnect = () => {
    console.log('user disconnection')
  }
}

module.exports = GameSocket;