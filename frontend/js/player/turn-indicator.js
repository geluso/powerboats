class TurnIndicator {
  static init(socket) {
    const container = document.getElementById('turn-order');
    const blocks = container.getElementsByClassName('player-block');
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      const color = block.getAttribute('data-player');
      block.addEventListener('click', () => {
        TurnIndicator.setTurnColor(color);
        socket.sendSetTurn(color);
      });
    }
  }

  static setTurnColor(color) {
    const container = document.getElementById('turn-order');
    const blocks = container.getElementsByClassName('player-block');
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      block.classList.remove('controlling');
      if (block.classList.contains(color)) {
        block.classList.add('controlling');
      }
    }
  }

  static getTurnColor() {
    const container = document.getElementById('turn-order');
    const blocks = container.getElementsByClassName('player-block');
    for (let i = 0; i < blocks.length; i++) {
      block.classList.remove('controlling');
      if (block.classList.contains(color)) {
        block.classList.add('controlling');
      }
    }
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = TurnIndicator;
}