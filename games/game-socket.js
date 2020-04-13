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
  constructor(io, socket, serverGames, gameName) {
    this.io = io;
    this.socket = socket;
    this.serverGames = serverGames;
    this.gameName = gameName;

    socket.emit('new-map', { game: serverGames.getGame(gameName).toJSON() });
    socket.emit('load-all-chat', { chat: serverGames.getChat(gameName) });
    socket.emit('load-all-history', { history: serverGames.getHistory(gameName) });

    this.handleChat = this.handleChat.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.handleDisconnect = this.handleDisconnect.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleSkipTurn = this.handleSkipTurn.bind(this);
    this.handleSetTurn = this.handleSetTurn.bind(this);

    socket.on('chat', this.handleChat);
    socket.on('action', this.handleAction);
    socket.on('disconnect', this.handleDisconnect);
    socket.on('mouse-move', this.handleMouseMove);
    socket.on('skip-turn', this.handleSkipTurn);
    socket.on('set-turn', this.handleSetTurn);

    this.handleConnect();
  }

  handleMouseMove = (data) => {
    const { color, tileRow, tileCol } = data;
    this.socket.broadcast.emit('mouse-move', data);
  }

  handleConnect = () => {
    const color = this.serverGames.join(this.gameName, this.socket);
    this.io.emit('player-join', { color, socketId: this.socket.id });
    this.io.emit('receive-history', { color, message: 'joined' });
  }

  handleDisconnect = () => {
    const color = this.serverGames.leave(this.gameName, this.socket);
    this.io.emit('player-leave', { color, socketId: this.socket.id });
    this.io.emit('receive-history', { color, message: 'left' });
  }

  handleChat = message => {
    const chat = this.serverGames.handleChat(message);
    this.io.emit('receive-chat', chat);
  }

  handleAction = message => {
    if (message.action === 'newMap') {
      const game = this.serverGames.newMap(message.gameName);
      this.io.emit('new-map', { game: game });
    } else if (message.action === 'ai-turn') {
      this.handleAITurn();
    } else {
      // make sure to generate stats before the player is modified
      const game = this.serverGames.getGame(this.gameName)
      const player = game.getPlayer(message.color);
      const playerOld = player.stats();

      const updatedPlayer = this.serverGames.handleAction(message);
      const playerNew = updatedPlayer.stats();

      const historyMessage = History.createMessage(message.action, playerOld, playerNew);

      this.io.emit('update-player', { player: updatedPlayer });
      this.sendUpdateTurn(game);
      this.io.emit('receive-history', historyMessage);
    }
  }

  handleAITurn() {
    const game = this.serverGames.getGame(this.gameName);
    const player = game.getCurrentPlayer();
    const color = player.color;
    const playerOld = player.stats();

    const actions = this.serverGames.aiTurn(game, color);
    const playerNew = player.stats();

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const msg = History.createAIMessage(action, playerOld, playerNew);
      if (msg.message !== undefined) {
        this.io.emit('receive-history', msg);
      }
    };

    this.io.emit('update-player', { player });

    game.nextTurn();
    this.sendUpdateTurn(game);
  }

  handleSkipTurn() {
    const game = this.serverGames.getGame(this.gameName);
    game.nextTurn();
    this.sendUpdateTurn(game);
  }

  handleSetTurn(json) {
    const game = this.serverGames.getGame(this.gameName);
    game.setTurn(json.color);
    this.sendUpdateTurn(game);
  }

  sendUpdateTurn(game) {
    const color = game.getCurrentPlayer().color;
    this.io.emit('receive-history', { color, message: 'starts turn' });
    this.io.emit('update-turn', { color });
  }
}


module.exports = GameSocket;