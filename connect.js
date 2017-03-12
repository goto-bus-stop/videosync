const { EventEmitter } = require('events')
const signalhub = require('signalhub')
const swarm = require('webrtc-swarm')

module.exports = function connect (name) {
  return (state, emitter) => {
    const hub = signalhub('videosync', [
      'https://videosync-hub-lhhpleecyz.now.sh'
    ])
    const sw = swarm(hub)

    let first = true
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

      // We're connecting to our very first other peer
      if (first && !peer.initiator) {
        peer.send(JSON.stringify({ type: 'state?' }))
      }

      first = false
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
