const html = require('bel')

module.exports = function ChatMessages (state, emit) {
  return html`
    <div class="chat fl w-25 ph2 h-100">
      <div class="chat-messages">
        ${state.chat.map(ChatMessage)}
      </div>
      <div class="pv2">
        <input class="w-100 ba b--dark-pink pa2"
               type="text"
               onkeydown=${oninput}
               placeholder="Chat" />
      </div>
    </div>
  `

  function ChatMessage ({ sender, message, time }) {
    return html`
      <p class="ma0 pv2">
        <time class="fr gray">${time.toLocaleTimeString()}</time>
        <strong class="dark-gray">${state.users[sender].name}</strong>
        ${message}
      </p>
    `
  }

  function oninput (event) {
    if (event.code === 'Enter') {
      emit('sendChat', event.target.value)
      event.target.value = ''
    }
  }
}
