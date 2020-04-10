const Game = require('./game');
const Screen = require('./screen');

const DiceAllPlayers = require('./dice-all-players');
const DiceLocalPlayer = require('./dice-local-player');

const MessageLog = require('./message-log');

class CurrentGame {
  constructor() {
    // set up the screen
    const width = window.innerWidth - $("#actions").width() - $("#boats").width() - 10;
    const height = window.innerHeight - $("#nav").height();

    this.boatSpeedIndicators = new DiceAllPlayers();

    this.screen = new Screen(width, height);
    this.game = null;

    this.logChat = new MessageLog('chat');
    this.logHistory = new MessageLog('history');
  }

  reset() {
    this.game = null;
  }

  setCurrentPlayer(color) {
    if (this.game === null) return;
    this.game.setCurrentPlayer(color);
  }

  newMap(json) {
    this.game = Game.fromJSON(json.game);
    this.screen.gameDrawer.measure(this.game.tilespace);
    this.draw();
  }

  updateGame(json) {
    this.game.updateFromJSON(json.game);
    this.draw();
  }

  updatePlayer(json) {
    if (this.game === null) return;
    this.game.updatePlayer(json.player);
    this.draw();
  }

  // {soketId, color}
  playerJoin(json) {
    console.log('player join', json);
  }

  // {soketId, color}
  playerLeave(json) {
    console.log('player leave', json);
  }

  draw() {
    if (this.game === null) return;
    const player = this.game.getCurrentPlayer();
    player.highlightRoute();

    this.screen.draw(this.game);
    DiceAllPlayers.display(this.game);
    DiceLocalPlayer.display(this.game.getCurrentPlayer());
  }

  handleMouseMove(e) {
    if (this.game === null) return;
    this.screen.handleMousemove(e, this.game);
    this.draw();
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = CurrentGame;
}