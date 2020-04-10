class History {
  static createMessage(action, playerOld, playerNew) {
    console.log('action', action, playerOld, playerNew);

    const oldDice = JSON.stringify(playerOld.dice);
    const newDice = JSON.stringify(playerNew.dice);

    let text;
    if (action === 'rollDice') {
      text = `rolled from ${oldDice} to ${newDice}`;
    } else if (action === 'dropDice') {
      text = `dropped from ${oldDice} to ${newDice}`;
    } else if (action === 'turnLeft') {
      text = `turned left`;
    } else if (action === 'turnRight') {
      text = `turned right`;
    } else if (action === 'goStraight') {
      let damage = playerNew.damage - playerOld.damage;
      if (damage > 0) {
        text = `moved ${playerNew.speed} forward taking ${damage} damage`;
      } else {
        text = `moved ${playerNew.speed} forward`;
      }
    }

    const message = { color: playerOld.color, message: text };
    return message;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = History;
}