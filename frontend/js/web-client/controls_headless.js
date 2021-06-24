const io = require('socket.io-client');
const Config = require('../config');
const URLUtils = require('../url-utils');

const PlayerSelection = require('./player-selection');
const TurnIndicator = require('./turn-indicator');

// socket.emit('chat', { chat: 'hello' });
// socket.on('', () => {})

class ControlsHeadless {
  constructor() {
    const gameName = URLUtils.getGameName();
    this.socket = io('/' + gameName);

    this.attach()
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
    var skipTurnButton = document.getElementById("skip-turn");

    var actions = {
      turnLeft: this.turnLeft.bind(this),
      turnRight: this.turnRight.bind(this),
      slowDown: this.slowDown.bind(this),
      speedUp: this.speedUp.bind(this),
      goStraight: this.goStraight.bind(this),
      newMap: this.newMap.bind(this),
      aiOrange: this.aiOrange.bind(this),
      sendSkipTurn: this.sendSkipTurn.bind(this),
      sendSetTurn: this.sendSetTurn.bind(this),
    };

    // build up individual dice controls
    const diceBank = document.getElementById('dice-bank');
    const diceSpots = diceBank.getElementsByClassName('dice-spot');
    for (let i = 0; i < Config.BOAT_MAX_DAMAGE; i++) {
      let spot = diceSpots[i];
      let rollButton = spot.getElementsByClassName('roll')[0];
      let dropButton = spot.getElementsByClassName('drop')[0];

      rollButton.addEventListener('click', () => {
        this.rollDice(i);
      });

      dropButton.addEventListener('click', () => {
        this.dropDice(i);
      });
    }

    this.attachButton(turnLeftButton, actions.turnLeft);
    this.attachButton(turnRightButton, actions.turnRight);
    this.attachButton(slowDownButton, actions.slowDown);
    this.attachButton(speedUpButton, actions.speedUp);
    this.attachButton(goStraightButton, actions.goStraight);

    this.attachButton(newMapButton, actions.newMap);
    this.attachButton(aiOrangeButton, actions.aiOrange);
    this.attachButton(skipTurnButton, actions.sendSkipTurn);
  }

  attachButton(btn, func) {
    btn.addEventListener("click", func);
  }

  turnLeft() {
    this.doAction('turnLeft');
  };

  turnRight() {
    this.doAction('turnRight');
  };

  slowDown() {
    const color = PlayerSelection.getCurrentPlayerColor();
    const player = this.currentGame.game.getPlayer(color);
    const index = player.dice.length - 1;
    this.dropDice(index);
  }

  speedUp() {
    const color = PlayerSelection.getCurrentPlayerColor();
    const player = this.currentGame.game.getPlayer(color);
    const index = player.dice.length;
    this.rollDice(index);
  }

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

  aiOrange() {
    const gameName = URLUtils.getGameName();
    this.socket.emit('action', { action: 'ai-turn', gameName });
  }

  doAction(action, params) {
    const actionParams = this.buildActionParams(action, params);
    actionParams.gameName = URLUtils.getGameName();
    this.socket.emit('action', actionParams);
  }

  buildActionParams(action, params) {
    const color = PlayerSelection.getCurrentPlayerColor();
    const direction = 'north';

    const actionParams = {
      color, action, direction,
      params,
    };

    return actionParams;
  }

  sendSkipTurn() {
    this.socket.emit('skip-turn');
  }

  sendSetTurn(color) {
    this.socket.emit('set-turn', { color });
  }

  handleUpdateTurn(json) {
    this.currentGame.game.setTurn(json.color);
    TurnIndicator.setTurnColor(json.color);
    this.currentGame.draw();
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = ControlsHeadless;
}