const CONFIG = require('./config')

class Dice {
  constructor(val) {
    this.roll();
    if (val) {
      this.val = val;
    }
  }
  static fromJSON(json) {
    const dice = new Dice(json.val);
    return dice;
  }

  toJSON() {
    const json = { val: this.val };
    return json;
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