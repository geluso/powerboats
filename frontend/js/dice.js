const CONFIG = require('./config')

class Dice {
  constructor(val) {
    this.roll();
    if (val) {
      this.val = val;
    }
  }

  roll() {
    var min = CONFIG.MIN_DICE;
    var max = CONFIG.MAX_DICE;
    this.value = Math.floor(Math.random() * max) + min;
  }
}


if (typeof module !== "undefined" && !!module) {
  module.exports = Dice;
}