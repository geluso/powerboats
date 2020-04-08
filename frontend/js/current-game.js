const Game = require('./game');
const Screen = require('./screen');

class CurrentGame {
  constructor() {
    // set up the screen
    const width = window.innerWidth;
    const height = window.innerHeight - $("#nav").height();

    this.screen = new Screen(width, height);
    this.game = null;
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

  loadAllChat(json) {
    this.clearAllChats();
    json.chat.forEach(this.receiveChat);
  }

  clearAllChats() {
    const chatList = document.getElementById('chat');
    while (chatList.firstChild) {
      chatList.firstChild.remove();
    }
  }

  receiveChat(chat) {
    const chatList = document.getElementById('chat');
    const li = document.createElement('li');

    const color = document.createElement('span');
    color.classList.add('chat-color');
    color.classList.add(chat.color);

    const message = document.createElement('span');
    message.textContent = chat.message;

    li.appendChild(color);
    li.appendChild(message);
    chatList.appendChild(li);
    chatList.scroll(0, 99999);
  }

  draw() {
    if (this.game === null) return;
    const player = this.game.getCurrentPlayer();
    player.highlightRoute();

    this.screen.draw(this.game);
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