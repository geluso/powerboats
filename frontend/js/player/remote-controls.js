const Game = require('../game');
const Screen = require('../screen');

const RemoteControls = {};

RemoteControls.initializeControls = function (screen, game) {
  function getCurrentPlayer() {
    var player = game.getCurrentPlayer();
    return player;
  }

  function turnLeft() {
    const url = 'http://localhost:3000/games/rainier/turn-left';
    console.log('remote turning left');
    fetch(url)
      .then(res => res.json())
      .then(json => {
        console.log('remote response');
        game.updateFromJSON(json.game);
        screen.draw();
      });
  };

  function goStraight() {
    const url = 'http://localhost:3000/games/rainier/go-straight';
    console.log('remote turning left');
    fetch(url)
      .then(res => res.json())
      .then(json => {
        console.log('remote response');
        game.updateFromJSON(json.boat);
        game.endTurn();

        screen.draw();
      });
  };

  function turnRight() {
    //if (OFF_CENTER_INDEX < 1) {
    getCurrentPlayer().turnRight();
    getCurrentPlayer().highlightRoute();
    //}

    // OFF_CENTER_INDEX++;
    // OFF_CENTER_INDEX = Math.min(OFF_CENTER_INDEX, 1);
  };

  function wrapInPlayerCheck(func) {
    return function () {
      // only allow humans to control their own boats, not AI boats.
      if (game.getCurrentPlayer().type.includes("human")) {
        func();
        screen.draw();
      }
    }
  }

  var publicFunctions = {
    turnLeft: turnLeft,
    turnRight: turnRight,
    goStraight: goStraight,
  };

  for (var key in publicFunctions) {
    var func = publicFunctions[key];
    publicFunctions[key] = wrapInPlayerCheck(func);
  }

  // attach buttons to functions
  var turnLeftButton = document.getElementById("turn-left");
  var goStraightButton = document.getElementById("go-straight");
  var turnRightButton = document.getElementById("turn-right");

  function attach(btn, func) {
    btn.addEventListener("click", func);
  }

  attach(turnLeftButton, publicFunctions.turnLeft);
  attach(goStraightButton, publicFunctions.goStraight);
  attach(turnRightButton, publicFunctions.turnRight);

  return publicFunctions;
}

if (typeof module !== "undefined" && !!module) {
  module.exports = RemoteControls;
}