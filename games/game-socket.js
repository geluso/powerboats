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
const Config = require('../frontend/js/config')

class GameSocket {
  constructor(io, socket, serverGame) {
    this.io = io;
    this.socket = socket;
    this.serverGame = serverGame;

    this.game = serverGame.game;
    this.chat = serverGame.chat;
    this.history = serverGame.history;

    socket.emit('new-map', { game: this.game.toJSON() });
    socket.emit('load-all-chat', { chat: this.chat });
    socket.emit('load-all-history', { history: this.history });

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
    const color = this.serverGame.join(this.socket);
    this.io.emit('player-join', { color, socketId: this.socket.id });
    this.io.emit('receive-history', { color, message: 'joined' });
  }

  handleDisconnect = () => {
    const color = this.serverGame.leave(this.socket);
    this.io.emit('player-leave', { color, socketId: this.socket.id });
    this.io.emit('receive-history', { color, message: 'left' });
  }

  handleChat = message => {
    const chat = this.serverGame.handleChat(message);
    this.io.emit('receive-chat', chat);
  }

  handleAction = message => {
    if (message.action === 'newMap') {
      const game = this.serverGame.newMap();
      this.io.emit('new-map', { game });
    } else if (message.action === 'ai-turn') {
      this.handleAITurn();
    } else {
      // make sure to generate stats before the player is modified
      const player = this.game.getPlayer(message.color);
      const playerOld = player.stats();

      const updatedPlayer = this.serverGame.handleAction(message);
      const playerNew = updatedPlayer.stats();

      const historyMessage = History.createMessage(message.action, playerOld, playerNew);

      this.io.emit('update-player', { player: updatedPlayer });
      this.sendUpdateTurn(this.game);
      this.io.emit('receive-history', historyMessage);
    }
  }

  handleAITurn() {
    const player = this.game.getCurrentPlayer();
    const color = player.color;

    // get a copy of the initial player to be used in generating history
    // message, like "player moved and took N damage"
    let playerOld = player.stats();

    const actionStates = this.serverGame.aiTurn(color);

    for (let i = 0; i < actionStates.length; i++) {
      const { action, state } = actionStates[i];
      const playerNew = state;
      const msg = History.createAIMessage(action, playerOld, playerNew);

      playerOld = playerNew;

      if (msg.message !== undefined) {
        setTimeout(() => {
          this.io.emit('receive-history', msg);
          this.io.emit('update-player', { player: state });
        }, i * Config.AI_BROADCAST_MOVE_DELAY);
      }
    };

    const totalDelay = actionStates.length * Config.AI_BROADCAST_MOVE_DELAY;
    setTimeout(() => {
      this.game.nextTurn();
      this.sendUpdateTurn(this.game);
    }, totalDelay);
  }

  handleSkipTurn() {
    this.game.nextTurn();
    this.sendUpdateTurn(this.game);
  }

  handleSetTurn(json) {
    this.game.setTurn(json.color);
    this.sendUpdateTurn(this.game);
  }

  sendUpdateTurn() {
    const color = this.game.getCurrentPlayer().color;
    this.io.emit('receive-history', { color, message: 'starts turn' });
    this.io.emit('update-turn', { color });
  }
}


module.exports = GameSocket;