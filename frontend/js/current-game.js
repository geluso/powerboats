const Config = require('./config');
const Game = require('./game');
const Screen = require('./screen');

const DiceAllPlayers = require('./dice-all-players');
const DiceLocalPlayer = require('./dice-local-player');

const MessageLog = require('./message-log');
const TurnIndicator = require('./player/turn-indicator');

class CurrentGame {
  constructor() {
    this.boatSpeedIndicators = new DiceAllPlayers();

    this.screen = new Screen();
    this.game = null;

    this.logChat = new MessageLog('chat');
    this.logHistory = new MessageLog('history');
    this.playerMouses = {};
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

    this.screen.draw(this.game, this.playerMouses);
    DiceAllPlayers.display(this.game);
    DiceLocalPlayer.display(this.game.getCurrentPlayer());

    const color = this.game.getCurrentPlayer().color;
    console.log('current player:', color);
    TurnIndicator.setTurnColor(color);
  }

  handleMouseMove(e) {
    if (this.game === null) return;

    const thing = this.screen.handleMousemove(e, this.game);
    this.draw();

    return thing;
  }

  receiveMouseMove(data) {
    const { color, tileRow, tileCol } = data;
    const freshTile = this.game.tilespace.getByKeyRowCol(tileRow, tileCol);

    // make sure to redraw the tile as its original color
    if (this.playerMouses[color]) {
      const staleTile = this.playerMouses[color];
      staleTile.isDirty = true;
      staleTile.hovering = false;

      const timerKey = color + '-timerId'
      let timerId = this.playerMouses[timerKey];
      if (timerId) {
        clearTimeout(timerId);
      }

      // reset the tile if the mouse hasn't moved for a while.
      timerId = setTimeout(() => {
        delete this.playerMouses[color];
        freshTile.isDirty = true;
        freshTile.hovering = false;
        this.draw()
      }, Config.MOUSE_MOVE_HIGHLIGHT_TIMEOUT);

      this.playerMouses[timerKey] = timerId;
    }

    this.playerMouses[color] = freshTile;
    this.draw()
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = CurrentGame;
}