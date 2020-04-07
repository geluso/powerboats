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
}

if (typeof module !== "undefined" && !!module) {
  module.exports = PlayerSelection;
}