const Controls = {};

Controls.initializeControls = function (currentGame) {
  var aiExplore = document.getElementById("ai-explore");
  attach(aiExplore, function () {
    currentGame.game.explore();
  });

  function getCurrentPlayer() {
    var player = currentGame.game.getCurrentPlayer();
    return player;
  }

  function turnLeft() {
    //if (OFF_CENTER_INDEX > -1) {
    getCurrentPlayer().turnLeft();
    getCurrentPlayer().highlightRoute();
    //}

    // OFF_CENTER_INDEX--;
    // OFF_CENTER_INDEX = Math.max(OFF_CENTER_INDEX, -1);
  };

  function goStraight() {
    getCurrentPlayer().goStraight();
    currentGame.game.endTurn();
  };

  function turnRight() {
    //if (OFF_CENTER_INDEX < 1) {
    getCurrentPlayer().turnRight();
    getCurrentPlayer().highlightRoute();
    //}

    // OFF_CENTER_INDEX++;
    // OFF_CENTER_INDEX = Math.min(OFF_CENTER_INDEX, 1);
  };

  function slowDown() {
    //if (CAN_ADJUST_SPEED) {
    getCurrentPlayer().slowDown();
    getCurrentPlayer().highlightRoute();
    //}

    //CAN_ADJUST_SPEED = false;

    reportSpeed();
  };

  function speedUp() {
    //if (CAN_ADJUST_SPEED) {
    getCurrentPlayer().speedUp();
    getCurrentPlayer().highlightRoute();
    //}

    //CAN_ADJUST_SPEED = false;

    reportSpeed();
  };

  var speedIndicator = document.getElementById("player-speed");
  function reportSpeed() {
    speedIndicator.textContent = getCurrentPlayer().speed();
  }

  function wrapInPlayerCheck(func) {
    return function () {
      // only allow humans to control their own boats, not AI boats.
      if (currentGame.game.getCurrentPlayer().type.includes("human")) {
        func();
        currentGame.screen.draw();
      }
    }
  }

  var publicFunctions = {
    turnLeft: turnLeft,
    turnRight: turnRight,
    goStraight: goStraight,
    slowDown: slowDown,
    speedUp: speedUp,
    reportSpeed: reportSpeed
  };

  for (var key in publicFunctions) {
    var func = publicFunctions[key];
    publicFunctions[key] = wrapInPlayerCheck(func);
  }

  // attach buttons to functions
  var turnLeftButton = document.getElementById("turn-left");
  var goStraightButton = document.getElementById("go-straight");
  var turnRightButton = document.getElementById("turn-right");

  var slowDownButton = document.getElementById("slowdown");
  var speedUpButton = document.getElementById("speedup");

  function attach(btn, func) {
    btn.addEventListener("click", func);
  }

  attach(turnLeftButton, publicFunctions.turnLeft);
  attach(goStraightButton, publicFunctions.goStraight);
  attach(turnRightButton, publicFunctions.turnRight);

  attach(slowDownButton, publicFunctions.slowDown);
  attach(speedUpButton, publicFunctions.speedUp);

  return publicFunctions;
}

if (typeof module !== "undefined" && !!module) {
  module.exports = Controls;
}
