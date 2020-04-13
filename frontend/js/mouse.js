class Mouse {
  constructor(canvas, currentGame) {
    this.canvas = canvas;
    this.currentGame = currentGame;

    this.isDragging = false;

    this.downX = 0;
    this.downY = 0;

    this.lastMoveX = 0;
    this.lastMoveY = 0;

    this.moveX = 0;
    this.moveY = 0;

    this.upX = 0;
    this.upY = 0;

    this.dx = 0;
    this.dy = 0;

    this.downXSpan = document.getElementById('down-xx');
    this.downYSpan = document.getElementById('down-yy');

    this.moveXSpan = document.getElementById('move-xx');
    this.moveYSpan = document.getElementById('move-yy');

    canvas.addEventListener('mousedown', this.handleMousedown.bind(this));
    canvas.addEventListener('mousemove', this.handleMousemove.bind(this));
    canvas.addEventListener('mouseup', this.handleMouseup.bind(this));

    canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  handleTouchStart(ev) {
    ev.preventDefault();

    const xx = ev.targetTouches[0].screenX;
    const yy = ev.targetTouches[0].screenY;

    this.moveX = xx;
    this.moveY = yy;

    const mouseParams = { offsetX: xx, offsetY: yy };
    this.handleMousedown(mouseParams);
  }

  handleTouchMove(ev) {
    ev.preventDefault();

    const xx = ev.targetTouches[0].screenX;
    const yy = ev.targetTouches[0].screenY;

    const mouseParams = { offsetX: xx, offsetY: yy };
    this.handleMousemove(mouseParams);
    this.currentGame.draw();
  }

  handleTouchEnd(ev) {
    ev.preventDefault();
    this.handleMouseup();
  }

  handleMousedown(ev) {
    this.isDragging = true;

    const [xx, yy] = [ev.offsetX, ev.offsetY];
    this.downX = xx;
    this.downY = yy;
  }

  handleMousemove(ev) {
    const [xx, yy] = [ev.offsetX, ev.offsetY];

    this.lastMoveX = this.moveX;
    this.lastMoveY = this.moveY;

    this.moveX = xx;
    this.moveY = yy;

    if (this.isDragging) {
      const dx = this.moveX - this.lastMoveX;
      const dy = this.moveY - this.lastMoveY;
      this.currentGame.screen.ctx.dx += dx;
      this.currentGame.screen.ctx.dy += dy;
      this.handleDrag();
    }
  }

  handleMouseup() {
    this.isDragging = false;
  }

  handleDrag() {
    const dx = this.moveX - this.lastMoveX;
    const dy = this.moveY - this.lastMoveY;
    this.currentGame.screen.ctx.translate(dx, dy);
    this.currentGame.screen.ctx.drawAll = true;
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = Mouse;
}