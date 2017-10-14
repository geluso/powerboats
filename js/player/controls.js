var CONTROLS = (function() {
  var turnLeftButton = document.getElementById("turn-left");
  var goStraightButton = document.getElementById("go-straight");
  var turnRightButton = document.getElementById("turn-right");

  var slowDownButton = document.getElementById("slowdown");
  var maintainSpeedButton = document.getElementById("maintain");
  var speedUpButton = document.getElementById("speedup");

  var aiExplore = document.getElementById("ai-explore");
  attach(aiExplore, function() {
    GAME.explore();
  });

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
    GAME.endTurn();
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

  function wrapInPlayerCheck(func) {
    return function() {
      // only allow humans to control their own boats, not AI boats.
      if (GAME.getCurrentPlayer().type.includes("human")) {
        func();
        draw();
      }
    }
  }

  var publicFunctions = {
    turnLeft: turnLeft,
    turnRight: turnRight,
    goStraight: goStraight,
    slowDown: slowDown,
    speedUp: speedUp,
    maintainSpeed: maintainSpeed,
    reportSpeed: reportSpeed
  };

  for (var key in publicFunctions) {
    var func = publicFunctions[key];
    publicFunctions[key] = wrapInPlayerCheck(func);
  }

  attach(turnLeftButton, publicFunctions.turnLeft);
  attach(goStraightButton, publicFunctions.goStraight);
  attach(turnRightButton, publicFunctions.turnRight);

  attach(slowDownButton, publicFunctions.slowDown);
  attach(maintainSpeedButton, publicFunctions.maintainSpeed);
  attach(speedUpButton, publicFunctions.speedUp);

  return publicFunctions;
})();
