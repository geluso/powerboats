const Config = require('./config')
const CurrentGame = require('./current-game');
const PlayerSelection = require('./player/player-selection');
const SocketControls = require('./player/socket-controls');

$(document).ready(main);

function main() {
  const currentGame = new CurrentGame();

  // set up the controls
  PlayerSelection.init(currentGame);
  new SocketControls(currentGame);

  const canvas = document.getElementById('canvas');
  $(canvas).mousemove(e => {
    currentGame.handleMouseMove(e);
  });

  let lastTimer = 0;
  let isFired = false;
  window.addEventListener('resize', () => {
    if (!isFired) {
      clearTimeout(lastTimer);
    }

    lastTimer = setTimeout(() => {
      isFired = true;
      currentGame.screen.setWidthHeight();
      currentGame.screen.gameDrawer.measure(currentGame.game.tilespace);
      currentGame.draw();
    }, Config.REDRAW_DELAY);

    isFired = false;
  });
}
