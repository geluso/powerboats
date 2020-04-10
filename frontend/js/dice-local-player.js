const Config = require('./config');

class DiceLocalPlayer {
  static display(player) {
    const diceBank = document.getElementById('dice-bank');
    const diceSpots = diceBank.getElementsByClassName('dice-spot');
    for (let i = 0; i < Config.BOAT_MAX_DAMAGE; i++) {
      let dice = player.dice[i];
      let spot = diceSpots[i];
      let diceValue = spot.getElementsByClassName('value')[0];
      if (dice) {
        diceValue.textContent = dice.value;
      } else {
        diceValue.textContent = 0;
      }

      const isDamaged = i >= Config.BOAT_MAX_DAMAGE - player.damage;
      if (isDamaged) {
        spot.classList.add('damaged');
      } else {
        spot.classList.remove('damaged');
      }
    }
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = DiceLocalPlayer;
}