class Dice {
  constructor() {
    this.roll();
  }

  roll() {
    var min = CONFIG.MIN_DICE;
    var max = CONFIG.MAX_DICE;
    this.value = Math.floor(Math.random() * max) + min;
  }
}
