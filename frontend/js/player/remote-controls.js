const RemoteControls = {};

RemoteControls.initializeControls = function (screen, game) {
  function getCurrentPlayer() {
    var player = game.getCurrentPlayer();
    return player;
  }

  function turnLeft() {
    getCurrentPlayer().turnLeft();
    getCurrentPlayer().highlightRoute();
    screen.draw();
  };

  function turnRight() {
    getCurrentPlayer().turnRight();
    getCurrentPlayer().highlightRoute();
    screen.draw();
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

  function buildParams(action) {
    const player = game.getCurrentPlayer();
    const { color, direction } = player;
    console.log('action');
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
    const player = game.getCurrentPlayer();
    console.log(player.color, player.speed());

    const gameName = 'rainier';
    const url = 'http://localhost:3000/games/' + gameName;
    const params = buildParams(action);

    console.log('player was', player.color, player.speed());
    fetch(url, params)
      .then(res => res.json())
      .then(json => {
        player.tile.isDirty = true;

        game.updateFromJSON(json.boat);
        player.highlightRoute();

        screen.draw();
        console.log('player now', player.color, player.speed());
      });
  }

  function wrapInPlayerCheck(func) {
    return function () {
      // only allow humans to control their own boats, not AI boats.
      // if (game.getCurrentPlayer().type.includes("human")) {
      func();
      screen.draw();
      // }
    }
  }

  var publicFunctions = {
    turnLeft: turnLeft,
    turnRight: turnRight,
    goStraight: goStraight,
    speedUp: speedUp,
    slowDown: slowDown,
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

  function attach(btn, func) {
    btn.addEventListener("click", func);
  }

  attach(turnLeftButton, publicFunctions.turnLeft);
  attach(turnRightButton, publicFunctions.turnRight);
  attach(goStraightButton, publicFunctions.goStraight);

  attach(speedUpButton, publicFunctions.speedUp);
  attach(slowDownButton, publicFunctions.slowDown);

  return publicFunctions;
}

if (typeof module !== "undefined" && !!module) {
  module.exports = RemoteControls;
}