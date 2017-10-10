(function() {
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
    console.log("turnLeft");
    PLAYER.turnLeft();
  };
  function goStraight() {
    console.log("goStraight");
    PLAYER.goStraight();
  };
  function turnRight() {
    console.log("turnRight");
    PLAYER.turnRight();
  };

  function slowDown() {
    console.log("slowDown");
    PLAYER.slowDown();
    PLAYER.goStraight();
  };
  function maintainSpeed() {
    console.log("maintainSpeed");
    PLAYER.goStraight();
  };
  function speedUp() {
    console.log("speedUp");
    PLAYER.speedUp();
    PLAYER.goStraight();
  };
})();
