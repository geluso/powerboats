class MessageLog {
  constructor(name) {
    this.name = name;

    this.loadAll = this.loadAll.bind(this);
    this.clearAll = this.clearAll.bind(this);
    this.receive = this.receive.bind(this);
  }

  loadAll(json) {
    this.clearAll();
    json[this.name].forEach(this.receive);
  }

  clearAll() {
    const chatList = document.getElementById(this.name);
    while (chatList.firstChild) {
      chatList.firstChild.remove();
    }
  }

  receive(json) {
    const chatList = document.getElementById(this.name);
    const li = document.createElement('li');

    const color = document.createElement('span');
    color.classList.add('chat-color');
    color.classList.add(json.color);

    const message = document.createElement('span');
    message.textContent = json.message;

    li.appendChild(color);
    li.appendChild(message);
    chatList.appendChild(li);
    chatList.scroll(0, 99999);
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = MessageLog;
}