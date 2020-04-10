const CurrentGame = require('./current-game');
const PlayerSelection = require('./player/player-selection');
const SocketControls = require('./player/socket-controls');

$(document).ready(main);

function main() {
  console.log('connecting')
  const currentGame = new CurrentGame();

  // set up the controls
  new SocketControls(currentGame);

  const canvas = document.getElementById('canvas');
  $(canvas).mousemove(e => {
    currentGame.handleMouseMove(e);
  });
}
