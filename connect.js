const { EventEmitter } = require('events')
const signalhub = require('signalhub')
const swarm = require('webrtc-swarm')

module.exports = function connect (name) {
  return (state, emitter) => {
    const hub = signalhub('videosync', [
      'http://localhost:3000'
    ])
    const sw = swarm(hub)

    sw.on('connect', (peer, id) => {
      peer.id = id

      peer.send(JSON.stringify({
        type: 'nick',
        payload: name
      }))

      peer.on('data', (pack) => {
        emitter.emit('message', Object.assign(
          { peer },
          JSON.parse(pack.toString('utf8'))
        ))
      })
    })

    function broadcast ({ type, payload }) {
      sw.peers.forEach((peer) => {
        peer.send(JSON.stringify({ type, payload }))
      })
    }

    emitter.on('broadcast', broadcast)
    emitter.emit('self', { id: sw.me, name })

    state.swarm = sw
  }
}
