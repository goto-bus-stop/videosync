const signalhub = require('signalhub')
const swarm = require('webrtc-swarm')

const HUB_URL = 'http://localhost:3000/'

const name = prompt('Your name')

const hub = signalhub('videosync', [
  HUB_URL
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

const users = {}

function sendChat (message) {
  sw.peers.forEach((peer) => {
    peer.send(JSON.stringify({
      type: 'chat',
      payload: message
    }))
  })
}

function setUserData (id, obj) {
  if (!users[id]) {
    users[id] = obj
    return obj
  }

  return Object.assign(users[id], obj)
}

function onreceive (peer, pack) {
  const { type, payload } = JSON.parse(pack.toString('utf8'))
  if (type === 'nick') {
    setUserData(peer.id, { name: payload })
  }
  if (type === 'chat') {
    const sender = users[peer.id]
    console.log(sender.name, payload)
  }
}

window.chat = sendChat
