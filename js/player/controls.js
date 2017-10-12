var CONTROLS = (function() {
  var turnLeftButton = document.getElementById("turn-left");
  var goStraightButton = document.getElementById("go-straight");
  var turnRightButton = document.getElementById("turn-right");

  var slowDownButton = document.getElementById("slowdown");
  var maintainSpeedButton = document.getElementById("maintain");
  var speedUpButton = document.getElementById("speedup");

  attach(turnLeftButton, turnLeft);
  attach(goStraightButton, goStraight);
  attach(turnRightButton, turnRight);

  attach(slowDownButton, slowDown);
  attach(maintainSpeedButton, maintainSpeed);
  attach(speedUpButton, speedUp);

  function attach(btn, func) {
    btn.addEventListener("click", func);
  }

  function getCurrentPlayer() {
    var player = GAME.getCurrentPlayer();
    return player;
  }

  function turnLeft() {
    getCurrentPlayer().turnLeft();
    getCurrentPlayer().highlightRoute();
  };
  function goStraight() {
    getCurrentPlayer().goStraight();
    getCurrentPlayer().highlightRoute();
  };
  function turnRight() {
    getCurrentPlayer().turnRight();
    getCurrentPlayer().highlightRoute();
  };

  function slowDown() {
    getCurrentPlayer().slowDown();
    getCurrentPlayer().highlightRoute();

    reportSpeed();
  };
  function maintainSpeed() {
    getCurrentPlayer().highlightRoute();
  };
  function speedUp() {
    getCurrentPlayer().speedUp();
    getCurrentPlayer().highlightRoute();

    reportSpeed();
  };

  var speedIndicator = document.getElementById("player-speed");
  function reportSpeed() {
    speedIndicator.textContent = getCurrentPlayer().speed();
  }

  return {
    turnLeft: turnLeft,
    turnRight: turnRight,
    goStraight: goStraight,
    slowDown: slowDown,
    speedUp: speedUp,
    maintainSpeed: maintainSpeed,
    reportSpeed: reportSpeed
  };
})();
