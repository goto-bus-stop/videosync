module.exports = (state, emitter) => {
  state.users = {}
  state.chat = []
  state.video = {
    paused: false,
    url: 'https://youtu.be/M3GAkXvKQ4c'
  }
  state.queue = []

  function updated () {
    emitter.emit('render')
  }

  function setUserData (id, obj) {
    if (!state.users[id]) {
      state.users[id] = {}
    }

    Object.assign(state.users[id], obj)
    updated()
  }

  function setUserName ({ user, name }) {
    setUserData(user, { name })
  }

  function sendChat (message) {
    emitter.emit('broadcast', { type: 'chat', payload: message })
    receiveChat({ sender: state.swarm.me, message })
  }

  function enqueue ({ user, url }) {
    state.queue.push({ user, url })
    if (!state.video && state.queue.length === 1) {
      nextVideo()
    } else {
      updated()
    }
  }

  function enqueueSelf (url) {
    const user = state.swarm.me
    enqueue({ user, url })

    emitter.emit('broadcast', { type: 'enqueue', payload: url })
  }

  function nextVideo () {
    state.video = state.queue.shift()
    if (state.video) {
      state.video.time = Date.now()
      state.video.paused = false
    }

    updated()
  }

  function pause ({ broadcast = true } = {}) {
    state.video = Object.assign({}, state.video, { paused: true })

    if (broadcast) emitter.emit('broadcast', { type: 'pause' })

    updated()
  }

  function resume ({ time, broadcast = true } = {}) {
    state.video = Object.assign({}, state.video, {
      paused: false,
      continueAt: time
    })

    if (broadcast) emitter.emit('broadcast', { type: 'resume', payload: time })

    updated()
  }

  function receiveChat ({ sender, message }) {
    state.chat.push({ sender, message, time: new Date() })
    updated()
  }

  function onself ({ id, name }) {
    setUserData(id, { name })
  }

  function onreceive ({ peer, type, payload }) {
    // New peer requested the current state.
    if (type === 'state?') {
      peer.send(JSON.stringify({
        type: 'state',
        payload: {
          video: state.video ? Object.assign({}, state.video, {
            continueAt: state.player.currentTime(),
            time: undefined
          }) : null,
          queue: state.queue
        }
      }))
    }
    // Received the current state from a peer.
    if (type === 'state') {
      state.video = payload.video
      state.queue = payload.queue

      updated()
    }

    if (type === 'nick') {
      setUserName({ user: peer.id, name: payload })
    }
    if (type === 'chat') {
      receiveChat({ sender: peer.id, message: payload })
    }
    if (type === 'pause') {
      pause({ broadcast: false })
    }
    if (type === 'resume') {
      resume({ broadcast: false, time: payload })
    }
    if (type === 'enqueue') {
      enqueue({ user: peer.id, url: payload })
    }
  }

  emitter.on('sendChat', sendChat)
  emitter.on('queue', enqueueSelf)
  emitter.on('nextVideo', nextVideo)
  emitter.on('resume', resume)
  emitter.on('pause', pause)

  emitter.on('self', onself)
  emitter.on('message', onreceive)

  emitter.on('player', (player) => {
    state.player = player
  })

  window.add = enqueueSelf
}
