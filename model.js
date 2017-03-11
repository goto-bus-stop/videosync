module.exports = (state, emitter) => {
  state.users = {}
  state.chat = []

  function setUserData (id, obj) {
    if (!state.users[id]) {
      state.users[id] = {}
    }

    Object.assign(state.users[id], obj)
  }

  function setUserName ({ user, name }) {
    setUserData(user, { name })
  }

  function sendChat (message) {
    emitter.emit('broadcast', { type: 'chat', payload: message })
  }
  function receiveChat ({ sender, message }) {
    state.chat.push({ sender, message })
  }

  function onreceive ({ peer, type, payload }) {
    if (type === 'nick') {
      setUserName({ user: peer.id, name: payload })
    }
    if (type === 'chat') {
      receiveChat({ sender: peer.id, message: payload })
    }

    emitter.emit('render')
  }

  emitter.on('render', () => {
    console.log('render', state)
  })

  emitter.on('message', onreceive)
}
