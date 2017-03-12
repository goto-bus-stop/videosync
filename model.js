module.exports = (state, emitter) => {
  state.users = {}
  state.chat = []
  state.video = {
    paused: false,
    url: 'https://youtu.be/M3GAkXvKQ4c'
  }

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
  }

  emitter.on('sendChat', sendChat)
  emitter.on('resume', resume)
  emitter.on('pause', pause)

  emitter.on('self', onself)
  emitter.on('message', onreceive)

  window.changeVideo = (url) => {
    state.video = Object.assign({}, state.video, { url })
    updated()
  }
}
