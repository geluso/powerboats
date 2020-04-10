class PlayerSelection {
  static init(currentGame) {
    const players = document.getElementById('players');
    const playerSelects = [...players.getElementsByClassName('player')];

    playerSelects.forEach(playerSelect => {
      playerSelect.addEventListener('click', () => {
        const color = playerSelect.getAttribute('data-player');
        PlayerSelection.setPlayer(currentGame, color);
      });
    });
  }

  static setPlayer(currentGame, setColor) {
    const players = document.getElementById('players');
    const playerSelects = [...players.getElementsByClassName('player')];
    for (let i = 0; i < playerSelects.length; i++) {
      const playerSelect = playerSelects[i];
      const color = playerSelect.getAttribute('data-player');
      if (color !== setColor) {
        playerSelect.classList.remove('controlling');
      } else {
        playerSelect.classList.add('controlling');
        currentGame.setCurrentPlayer(color);
      }
    }

    currentGame.draw();
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = PlayerSelection;
}