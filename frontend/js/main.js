const Config = require('./config')
const CurrentGame = require('./current-game');
const PlayerSelection = require('./web-client/player-selection');
const TurnIndicator = require('./web-client/turn-indicator');
const SocketControls = require('./web-client/socket-controls');
const Pages = require('./web-client/pages');

const Mouse = require('./mouse');

$(document).ready(main);

function main() {
  const currentGame = new CurrentGame();

  // set up the controls
  const socket = new SocketControls(currentGame);
  PlayerSelection.init(currentGame);
  TurnIndicator.init(socket);
  Pages.init();

  const canvas = document.getElementById('canvas');
  const mouse = new Mouse(canvas, currentGame);
  $(canvas).mousemove(e => {
    const thing = currentGame.handleMouseMove(e);
    if (thing) {
      socket.broadcastMouseMove(thing);
    }
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
