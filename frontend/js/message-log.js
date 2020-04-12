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

    const colorBlock = document.createElement('span');
    if (!json.username) {
      colorBlock.classList.add('chat-color');
      colorBlock.classList.add(json.color);
    } else {
      colorBlock.classList.add('chat-username');
      colorBlock.classList.add(json.color);
      colorBlock.textContent = json.username + ':';
    }

    const message = document.createElement('span');
    message.textContent = json.message;

    li.appendChild(colorBlock);
    li.appendChild(message);
    chatList.appendChild(li);
    chatList.scroll(0, 99999);
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = MessageLog;
}