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

    socket.emit('update', { game: serverGames.getGame('rainier').toJSON() });

    socket.on('chat', this.handleChat);
    socket.on('action', this.handleAction);
    socket.on('disconnect', this.handleDisconnect);
  }

  handleChat = message => {
    console.log('handle chat', message);
  }

  handleAction = message => {
    console.log('handle action', message);
    this.serverGames.handleAction(message);
  }

  handleDisconnect = () => {
    console.log('user disconnection')

  }
}

module.exports = GameSocket;