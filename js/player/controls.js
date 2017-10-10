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


  function turnLeft() {
    PLAYER.turnLeft();
    PLAYER.highlightRoute();
  };
  function goStraight() {
    PLAYER.goStraight();
    PLAYER.highlightRoute();
  };
  function turnRight() {
    PLAYER.turnRight();
    PLAYER.highlightRoute();
  };

  function slowDown() {
    PLAYER.slowDown();
    PLAYER.highlightRoute();

    reportSpeed();
  };
  function maintainSpeed() {
    PLAYER.highlightRoute();
  };
  function speedUp() {
    PLAYER.speedUp();
    PLAYER.highlightRoute();

    reportSpeed();
  };

  var speedIndicator = document.getElementById("player-speed");
  function reportSpeed() {
    speedIndicator.textContent = PLAYER.speed();
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
