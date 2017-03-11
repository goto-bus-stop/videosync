const signalhub = require('signalhub')
const swarm = require('webrtc-swarm')
const model = require('./model')

const name = prompt('Your name')

const hub = signalhub('videosync', [
  'http://localhost:3000'
])
const sw = swarm(hub)

sw.on('connect', (peer, id) => {
  peer.send(JSON.stringify({
    type: 'nick',
    payload: name
  }))

  peer.on('data', (pack) => {
    onreceive(peer, pack)
  })
})

function sendChat (message) {
  sw.peers.forEach((peer) => {
    peer.send(JSON.stringify({
      type: 'chat',
      payload: message
    }))
  })
}

function onreceive (peer, pack) {
  const { type, payload } = JSON.parse(pack.toString('utf8'))
  if (type === 'nick') {
    model.setUserName(peer.id, payload)
  }
  if (type === 'chat') {
    const sender = model.users[peer.id]
    console.log(sender.name, payload)
  }
}

window.chat = sendChat
