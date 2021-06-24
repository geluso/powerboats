const PlayerSelection = require('./web-client/player-selection');
const TurnIndicator = require('./web-client/turn-indicator');
const ControlsHeadless = require('./web-client/controls_headless');

$(document).ready(main);

function main() {
  const socket = new ControlsHeadless();
}
