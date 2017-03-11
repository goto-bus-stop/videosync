module.exports = (state, emitter) => {
  state.users = {}
  state.chat = []

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
  }

  emitter.on('sendChat', sendChat)

  emitter.on('self', onself)
  emitter.on('message', onreceive)
}
