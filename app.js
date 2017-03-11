const model = require('./model')
const connect = require('./connect')

const name = prompt('Your name')

const conn = connect('name')

function sendChat (message) {
  conn.broadcast('chat', message)
}

conn.on('data', onreceive)
function onreceive (peer, { type, payload }) {
  if (type === 'nick') {
    model.setUserName(peer.id, payload)
  }
  if (type === 'chat') {
    model.receiveChat(peer.id, payload)
  }
}

window.chat = sendChat
