const Game = require('../game');
const GameDrawer = require('../drawers/game-drawer');

const RemoteControls = {};

RemoteControls.initializeControls = function (currentGame) {
  function getCurrentPlayer() {
    var player = currentGame.game.getCurrentPlayer();
    return player;
  }

  function turnLeft() {
    sendAction('turnLeft');

    getCurrentPlayer().turnLeft();
    getCurrentPlayer().highlightRoute();
    currentGame.screen.draw();
  };

  function turnRight() {
    sendAction('turnRight');

    getCurrentPlayer().turnRight();
    getCurrentPlayer().highlightRoute();
    currentGame.screen.draw();
  };

  function speedUp() {
    sendAction('speedUp');
  }

  function slowDown() {
    sendAction('slowDown');
  }

  function goStraight() {
    sendAction('goStraight');
  };

  function resetGame() {
    console.log('resetting')
    sendAction('resetGame');
  };

  function buildParams(action) {
    const player = currentGame.game.getCurrentPlayer();
    const { color, direction } = player;
    const gameParams = {
      color, action, direction,
    };

    const fetchParams = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(gameParams)
    }

    return fetchParams;
  }

  function sendAction(action) {
    const gameName = 'rainier';
    const url = '/games/' + gameName;
    const params = buildParams(action);

    fetch(url, params)
      .then(res => res.json())
      .then(json => {
        if (json.game.course === undefined) {
          currentGame.game.updateFromJSON(json.game);
        } else {
          currentGame.screen.destroyHandlers();

          const game = Game.fromJSON(json.game);

          const width = window.innerWidth;
          const height = window.innerHeight;
          const screen = new Screen(width, height, game);

          currentGame.game = game;
          currentGame.screen = screen;
        }

        const player = currentGame.game.getCurrentPlayer();
        player.tile.isDirty = true;
        player.highlightRoute();

        currentGame.screen.draw();
      });
  }

  function wrapInPlayerCheck(func) {
    return function () {
      // only allow humans to control their own boats, not AI boats.
      // if (game.getCurrentPlayer().type.includes("human")) {
      func();
      currentGame.screen.draw();
      // }
    }
  }

  var publicFunctions = {
    turnLeft: turnLeft,
    turnRight: turnRight,
    goStraight: goStraight,
    speedUp: speedUp,
    slowDown: slowDown,
    resetGame: resetGame,
  };

  for (var key in publicFunctions) {
    var func = publicFunctions[key];
    publicFunctions[key] = wrapInPlayerCheck(func);
  }

  // attach buttons to functions
  var turnLeftButton = document.getElementById("turn-left");
  var turnRightButton = document.getElementById("turn-right");
  var goStraightButton = document.getElementById("go-straight");

  var speedUpButton = document.getElementById("speedup");
  var slowDownButton = document.getElementById("slowdown");
  var resetGameButton = document.getElementById("reset");

  function attach(btn, func) {
    btn.addEventListener("click", func);
  }

  attach(turnLeftButton, publicFunctions.turnLeft);
  attach(turnRightButton, publicFunctions.turnRight);
  attach(goStraightButton, publicFunctions.goStraight);

  attach(speedUpButton, publicFunctions.speedUp);
  attach(slowDownButton, publicFunctions.slowDown);
  attach(resetGameButton, publicFunctions.resetGame);

  return publicFunctions;
}

if (typeof module !== "undefined" && !!module) {
  module.exports = RemoteControls;
}