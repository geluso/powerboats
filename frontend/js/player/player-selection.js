class PlayerSelection {
  static init(currentGame) {
    const players = document.getElementById('players');
    const playerSelects = [...players.getElementsByClassName('player')];

    let currentPlayerSelect;
    playerSelects.forEach(playerSelect => {
      if (playerSelect.classList.contains('controlling')) {
        currentPlayerSelect = playerSelect;
      }

      playerSelect.addEventListener('click', () => {
        const color = playerSelect.getAttribute('data-player');
        currentGame.setCurrentPlayer(color);

        currentPlayerSelect.classList.remove('controlling');
        playerSelect.classList.add('controlling');
        currentPlayerSelect = playerSelect;

        currentGame.draw();
      });
    });
  }

  static setPlayer(setColor) {
    const players = document.getElementById('players');
    const playerSelects = [...players.getElementsByClassName('player')];
    for (let i = 0; i < playerSelects.length; i++) {
      const color = playerSelect.getAttribute('data-player');
      if (color === setColor) {
        playerSelect.classList.add('controlling');

        currentGame.setCurrentPlayer(color);
        currentGame.draw();
        return
      }
    }
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = PlayerSelection;
}