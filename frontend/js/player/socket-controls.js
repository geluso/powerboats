const io = require('socket.io-client');

// socket.emit('chat', { chat: 'hello' });
// socket.on('', () => {})

class SocketControls {
  constructor(currentGame) {
    this.currentGame = currentGame;

    this.socket = io();
    this.socket.on('update-game', json => currentGame.updateGame(json));
    this.socket.on('update-player', json => currentGame.updatePlayer(json));

    this.attach();
  }

  attach() {
    // attach buttons to functions
    var turnLeftButton = document.getElementById("turn-left");
    var turnRightButton = document.getElementById("turn-right");
    var goStraightButton = document.getElementById("go-straight");

    var speedUpButton = document.getElementById("speedup");
    var slowDownButton = document.getElementById("slowdown");

    var actions = {
      turnLeft: this.turnLeft.bind(this),
      turnRight: this.turnRight.bind(this),
      goStraight: this.goStraight.bind(this),
      speedUp: this.speedUp.bind(this),
      slowDown: this.slowDown.bind(this),
    };

    for (var action in actions) {
      var func = actions[action];
      actions[action] = this.wrapWithDraw(func);
    }

    this.attachButton(turnLeftButton, actions.turnLeft);
    this.attachButton(turnRightButton, actions.turnRight);
    this.attachButton(goStraightButton, actions.goStraight);

    this.attachButton(speedUpButton, actions.speedUp);
    this.attachButton(slowDownButton, actions.slowDown);
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

  speedUp() {
    this.doAction('speedUp');
  }

  slowDown() {
    this.doAction('slowDown');
  }

  goStraight() {
    this.doAction('goStraight');
  }

  doAction(action) {
    const actionParams = this.buildActionParams(action);
    actionParams.gameName = 'rainier';
    this.socket.emit('action', actionParams);
  }

  buildActionParams(action) {
    const player = this.currentGame.game.getCurrentPlayer();
    const { color, direction } = player;
    const actionParams = {
      color, action, direction,
    };

    return actionParams;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = SocketControls;
}