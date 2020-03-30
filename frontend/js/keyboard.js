(function() {
  $(document).keyup(release);

  var KEYBOARD = {},
    LEFT = 37,
    UP = 38,
    RIGHT = 39,
    DOWN = 40;
    ENTER = 13;

  function release(e) {
    KEYBOARD[e.which] = true;

    if (KEYBOARD[LEFT]) {
      CONTROLS.turnLeft();
    }

    if (KEYBOARD[RIGHT]) {
      CONTROLS.turnRight();
    }

    if (KEYBOARD[UP]) {
      CONTROLS.speedUp();
    }
    if (KEYBOARD[DOWN]) {
      CONTROLS.slowDown();
    }
    if (KEYBOARD[ENTER]) {
      CONTROLS.goStraight();
    }

    KEYBOARD[e.which] = false;
  }
})();
