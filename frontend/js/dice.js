const CONFIG = require('./config')

class Dice {
  constructor(value) {
    if (value) {
      this.value = value;
    } else {
      this.roll();
    }
  }
  static fromJSON(json) {
    const dice = new Dice(json);
    return dice;
  }

  toJSON() {
    return this.value;
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