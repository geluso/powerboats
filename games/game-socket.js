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

const History = require('../frontend/js/history');

class GameSocket {
  constructor(io, socket, serverGames) {
    this.io = io;
    this.socket = socket;
    this.serverGames = serverGames;

    socket.emit('new-map', { game: serverGames.getGame('rainier').toJSON() });
    socket.emit('load-all-chat', { chat: serverGames.getChat('rainier') });
    socket.emit('load-all-history', { history: serverGames.getHistory('rainier') });

    this.handleChat = this.handleChat.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);

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
      // make sure to generate stats before the player is modified
      const player = this.serverGames.getGame('rainier').getPlayer(message.color);
      const playerOld = player.stats();

      const updatedPlayer = this.serverGames.handleAction(message);
      const playerNew = updatedPlayer.stats();

      const historyMessage = History.createMessage(message.action, playerOld, playerNew);
      console.log(historyMessage);

      this.io.emit('update-player', { player: updatedPlayer });
      this.io.emit('receive-history', historyMessage);
    }
  }

  handleDisconnect = () => {
    console.log('user disconnection')
  }
}

module.exports = GameSocket;