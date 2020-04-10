class History {
  static createMessage(action, playerOld, playerNew) {
    let oldDice = '' + playerOld.dice;
    let newDice = '' + playerNew.dice;

    if (oldDice === '') {
      oldDice = 0;
    }

    if (newDice === '') {
      newDice = 0;
    }

    let text;
    if (action === 'rollDice') {
      text = `rolled ${oldDice} to ${newDice}`;
    } else if (action === 'dropDice') {
      text = `dropped ${oldDice} to ${newDice}`;
    } else if (action === 'turnLeft') {
      text = `turned left`;
    } else if (action === 'turnRight') {
      text = `turned right`;
    } else if (action === 'goStraight') {
      let damage = playerNew.damage - playerOld.damage;
      if (damage > 0) {
        text = `moved ${playerNew.speed} w/ ${damage} damage`;
      } else {
        text = `moved ${playerNew.speed}`;
      }
    }

    const message = { color: playerOld.color, message: text };
    return message;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = History;
}