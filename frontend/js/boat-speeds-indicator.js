const Config = require('./config');

class BoatSpeedsIndicator {
  static clearBoatSpeeds() {
    const container = document.getElementById('speeds-container');
    while (container.firstChild) {
      firstChild.remove();
    }
  }

  static speedIndicator(boat) {
    const div = document.createElement('div');
    div.classList.add('speed-container');

    const colorSpan = document.createElement('span');
    colorSpan.classList.add('chat-color', boat.color);
    div.appendChild(colorSpan);

    for (let i = 0; i < Config.BOAT_MAX_DAMAGE; i++) {
      const speed = document.createElement('span');
      speed.classList.add('speed');

      const dice = boat.dice[i];
      const isDamaged = i >= (Config.BOAT_MAX_DAMAGE - boat.damage);
      if (isDamaged) {
        speed.classList.add('damaged');
        speed.textContent = 'X';
      } else if (dice === undefined) {
        speed.textContent = 0;
      } else {
        speed.textContent = dice.value;
      }

      // add a space between speeds for better visuals
      speed.textContent += ' ';
      div.appendChild(speed);
    };


    return div;
  }

  static removeAll() {
    const container = document.getElementById('speeds-container');
    while (container.firstChild) {
      container.firstChild.remove();
    }
  }

  static display(game) {
    BoatSpeedsIndicator.removeAll();

    const container = document.getElementById('speeds-container');
    game.boats.forEach(boat => {
      const speedIndicator = BoatSpeedsIndicator.speedIndicator(boat);
      speedIndicator.class = 'speed-container';
      container.appendChild(speedIndicator);
    })
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = BoatSpeedsIndicator;
}