class PlayerSelection {
  static init(game, screen) {
    const players = document.getElementById('players');
    const playerSelects = [...players.getElementsByClassName('player')];

    let currentPlayerSelect;
    playerSelects.forEach(playerSelect => {
      if (playerSelect.classList.contains('controlling')) {
        currentPlayerSelect = playerSelect;
      }

      playerSelect.addEventListener('click', () => {
        const color = playerSelect.getAttribute('data-player');
        game.setCurrentPlayer(color);

        currentPlayerSelect.classList.remove('controlling');
        playerSelect.classList.add('controlling');
        currentPlayerSelect = playerSelect;

        screen.draw();
      });
    });
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = PlayerSelection;
}