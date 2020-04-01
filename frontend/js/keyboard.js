const Keyboard = {};

Keyboard.init = (controls) => {
  $(document).keyup(release);

  const KEYBOARD = {};
  const LEFT = 37;
  const UP = 38;
  const RIGHT = 39;
  const DOWN = 40;
  const ENTER = 13;

  function release(e) {
    KEYBOARD[e.which] = true;

    if (KEYBOARD[LEFT]) {
      controls.turnLeft();
    }

    if (KEYBOARD[RIGHT]) {
      controls.turnRight();
    }

    if (KEYBOARD[UP]) {
      controls.speedUp();
    }
    if (KEYBOARD[DOWN]) {
      controls.slowDown();
    }
    if (KEYBOARD[ENTER]) {
      controls.goStraight();
    }

    KEYBOARD[e.which] = false;
  }
};

if (typeof module !== "undefined" && !!module) {
  module.exports = Keyboard;
}