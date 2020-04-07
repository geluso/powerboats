const GameDrawer = require('./drawers/game-drawer')

var MOUSE_X = 0;
var MOUSE_Y = 0;

var LAST_THING;

class Screen {
  constructor(width, height) {
    this.isDirty = true;

    var canvas = document.getElementById("canvas");
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");
    this.ctx = ctx;

    ctx.width = width;
    ctx.height = height;

    this.gameDrawer = new GameDrawer(ctx);

    this.handleMousemove = this.handleMousemove.bind(this);
  }

  handleMousemove(e, game) {
    MOUSE_X = e.offsetX;
    MOUSE_Y = e.offsetY;

    var thing = game.tilespace.getTile(MOUSE_X, MOUSE_Y);
    if (!thing) return;

    this.isDirty = false;
    if (thing !== LAST_THING) {
      if (LAST_THING !== undefined) {
        LAST_THING.hovering = false;
        LAST_THING.isDirty = true;
      }
      this.isDirty = true;

      thing.hovering = true;
      thing.isDirty = true;

      LAST_THING = thing;
    }
  }

  draw(game) {
    this.gameDrawer.draw(game);
  }

  destoryHandlers() {
    document.removeEventListener("mousemove", this.handleMousemove);
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = Screen;
}