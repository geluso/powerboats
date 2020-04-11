const GameDrawer = require('./drawers/game-drawer')

var MOUSE_X = 0;
var MOUSE_Y = 0;

var LAST_THING;

class Screen {
  constructor() {
    this.isDirty = true;

    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.setWidthHeight();

    this.gameDrawer = new GameDrawer(this.ctx);

    this.handleMousemove = this.handleMousemove.bind(this);
  }

  setWidthHeight() {
    // set up the screen
    const width = window.innerWidth - $("#actions").width() - $("#boats").width() - 10;
    const height = window.innerHeight - $("#nav").height();

    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.width = width;
    this.ctx.height = height;
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