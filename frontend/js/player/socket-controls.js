const io = require('socket.io-client');
const Config = require('../config');
const PlayerSelection = require('./player-selection');

// socket.emit('chat', { chat: 'hello' });
// socket.on('', () => {})

class SocketControls {
  constructor(currentGame) {
    this.currentGame = currentGame;

    this.socket = io();

    this.socket.on('new-map', json => currentGame.newMap(json));
    this.socket.on('update-game', json => currentGame.updateGame(json));
    this.socket.on('update-player', json => currentGame.updatePlayer(json));

    this.socket.on('load-all-history', json => currentGame.logHistory.loadAll(json));
    this.socket.on('receive-history', json => currentGame.logHistory.receive(json));

    this.socket.on('load-all-chat', json => currentGame.logChat.loadAll(json));
    this.socket.on('receive-chat', json => currentGame.logChat.receive(json));

    this.attach();
    this.attachChat();

    this.playerJoin = this.playerJoin.bind(this);
    this.playerLeave = this.playerLeave.bind(this);

    this.socket.on('player-join', this.playerJoin);
    this.socket.on('player-leave', this.playerLeave);
  }

  // socketId, color
  playerJoin(json) {
    if (json.socketId === this.socket.id) {
      console.log('i joined!', json.color);
      PlayerSelection.setPlayer(this.currentGame, json.color);
    } else {
      console.log('someone else joined')
    }
  }

  playerLeave(json) {

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

    var slowDownButton = document.getElementById("dice-down");
    var speedUpButton = document.getElementById("dice-up");

    var goStraightButton = document.getElementById("go-straight");

    var newMapButton = document.getElementById("new-map");
    var aiOrangeButton = document.getElementById("ai-orange");

    var actions = {
      turnLeft: this.turnLeft.bind(this),
      turnRight: this.turnRight.bind(this),
      slowDown: this.slowDown.bind(this),
      speedUp: this.speedUp.bind(this),
      goStraight: this.goStraight.bind(this),
      newMap: this.newMap.bind(this),
      aiOrange: this.aiOrange.bind(this),
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
    this.attachButton(slowDownButton, actions.slowDown);
    this.attachButton(speedUpButton, actions.speedUp);
    this.attachButton(goStraightButton, actions.goStraight);

    this.attachButton(newMapButton, actions.newMap);
    this.attachButton(aiOrangeButton, actions.aiOrange);
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

  slowDown() {
    const index = this.currentGame.game.getCurrentPlayer().dice.length - 1;
    this.dropDice(index);
  }

  speedUp() {
    const index = this.currentGame.game.getCurrentPlayer().dice.length;
    this.rollDice(index);
  }

  goStraight() {
    this.doAction('goStraight');
    const currentColor = PlayerSelection.getCurrentPlayer();
    setTimeout(() => {
      this.aiOrange();
      setTimeout(() => {
        PlayerSelection.setPlayer(this.currentGame, currentColor);
      }, 500);
    }, 500);
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

  aiOrange() {
    PlayerSelection.setPlayer(this.currentGame, 'orange');
    this.socket.emit('action', { action: 'ai-turn', color: 'orange' });
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