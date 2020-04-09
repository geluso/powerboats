const io = require('socket.io-client');
const Config = require('../config');

// socket.emit('chat', { chat: 'hello' });
// socket.on('', () => {})

class SocketControls {
  constructor(currentGame) {
    this.currentGame = currentGame;

    this.socket = io();

    this.socket.on('new-map', json => currentGame.newMap(json));
    this.socket.on('update-game', json => currentGame.updateGame(json));
    this.socket.on('update-player', json => currentGame.updatePlayer(json));

    this.socket.on('load-all-chat', json => currentGame.loadAllChat(json));
    this.socket.on('receive-chat', json => currentGame.receiveChat(json));

    this.attach();
    this.attachChat();
  }

  attachChat() {
    const form = document.getElementById('chat-box');
    const that = this;
    form.addEventListener('submit', ev => {
      ev.preventDefault();

      const input = document.getElementById('chat-input');
      const text = input.value;
      input.value = '';

      const data = {
        color: that.currentGame.game.getCurrentPlayer().color,
        gameName: 'rainier',
        message: text
      }
      that.socket.emit('chat', data);
    })
  }

  attach() {
    // attach buttons to functions
    var turnLeftButton = document.getElementById("turn-left");
    var turnRightButton = document.getElementById("turn-right");
    var goStraightButton = document.getElementById("go-straight");
    var newMapButton = document.getElementById("new-map");

    var actions = {
      turnLeft: this.turnLeft.bind(this),
      turnRight: this.turnRight.bind(this),
      goStraight: this.goStraight.bind(this),
      newMap: this.newMap.bind(this),
    };

    for (var action in actions) {
      var func = actions[action];
      actions[action] = this.wrapWithDraw(func);
    }

    // build up individual dice controls
    const diceBank = document.getElementById('dice-bank');
    const diceSpots = diceBank.getElementsByClassName('dice-spot');
    for (let i = 0; i < Config.BOAT_MAX_DAMAGE; i++) {
      let spot = diceSpots[i];
      let rollButton = spot.getElementsByClassName('roll')[0];
      let dropButton = spot.getElementsByClassName('drop')[0];

      rollButton.addEventListener('click', () => {
        this.rollDice(i);
        this.currentGame.draw();
      });

      dropButton.addEventListener('click', () => {
        this.dropDice(i);
        this.currentGame.draw();
      });
    }

    this.attachButton(turnLeftButton, actions.turnLeft);
    this.attachButton(turnRightButton, actions.turnRight);
    this.attachButton(goStraightButton, actions.goStraight);

    this.attachButton(newMapButton, actions.newMap);
  }

  attachButton(btn, func) {
    btn.addEventListener("click", func);
  }

  wrapWithDraw(func) {
    return () => {
      func();
      this.currentGame.draw();
    }
  }

  turnLeft() {
    this.doAction('turnLeft');

    this.currentGame.game.getCurrentPlayer().turnLeft();
    this.currentGame.game.getCurrentPlayer().highlightRoute();
    this.currentGame.draw();
  };

  turnRight() {
    this.doAction('turnRight');

    this.currentGame.game.getCurrentPlayer().turnRight();
    this.currentGame.game.getCurrentPlayer().highlightRoute();
    this.currentGame.draw();
  };

  goStraight() {
    this.doAction('goStraight');
  }

  rollDice(index) {
    this.doAction('rollDice', { index });
  }

  dropDice(index) {
    this.doAction('dropDice', { index });
  }

  newMap() {
    this.doAction('newMap');
  }

  doAction(action, params) {
    const actionParams = this.buildActionParams(action, params);
    actionParams.gameName = 'rainier';
    this.socket.emit('action', actionParams);
  }

  buildActionParams(action, params) {
    const player = this.currentGame.game.getCurrentPlayer();
    const { color, direction } = player;
    const actionParams = {
      color, action, direction,
      params,
    };

    return actionParams;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = SocketControls;
}