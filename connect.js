const { EventEmitter } = require('events')
const signalhub = require('signalhub')
const swarm = require('webrtc-swarm')

module.exports = function connect (nickname) {
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
      evts.emit('data', peer, JSON.parse(pack.toString('utf8')))
    })
  })

  const evts = new EventEmitter()
  Object.assign(evts, {
    swarm: sw,
    broadcast: (type, payload) => {
      sw.peers.forEach((peer) => {
        peer.send(JSON.stringify({ type, payload }))
      })
    }
  })

  return evts
}
