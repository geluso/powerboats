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
  };
  function goStraight() {
    console.log("goStraight");
  };
  function turnRight() {
    console.log("turnRight");
  };

  function slowDown() {
    console.log("slowDown");
  };
  function maintainSpeed() {
    console.log("maintainSpeed");
  };
  function speedUp() {
    console.log("speedUp");
  };
})();
