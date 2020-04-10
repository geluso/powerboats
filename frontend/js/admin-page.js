const io = require('socket.io-client');
$(document).ready(main);

function main() {

}

class Admin {
  constructor() {
    this.socket = io();
  }
}

if (typeof module !== "undefined" && !!module) {
  module.exports = Admin;
}