const choo = require('choo')
const html = require('bel')
const css = require('sheetify')
const model = require('./model')
const connect = require('./connect')

css('tachyons')

const conn = connect(prompt('Your name'))

const prefix = css`
  :host .chat {
    display: flex;
    flex-direction: column;
  }

  :host .chat-messages {
    flex-grow: 1;
  }
`

function ChatMessage (state, { sender, message, time }) {
  return html`
    <p class="ma0 pv2">
      <time class="fr gray">${time.toLocaleTimeString()}</time>
      <strong class="dark-gray">${state.users[sender].name}</strong>
      ${message}
    </p>
  `
}

const mainView = (state, emit) => {
  return html`
    <body class="${prefix} vh-100">
      <div class="fl w-75 h-100 ph2">
        <h1>Video here</h1>
      </div>
      <div class="chat fl w-25 ph2 h-100">
        <div class="chat-messages">
          ${state.chat.map(ChatMessage.bind(null, state))}
        </div>
        <div class="pv2">
          <input class="w-100 ba b--dark-pink pa2"
                 type="text"
                 onkeydown=${oninput}
                 placeholder="Chat" />
        </div>
      </div>
      <div class="users w-25 dn">
        <ul class="list">
          ${Object.entries(state.users).map(([ id, { name } ]) => html`
            <li>${name}</li>
          `)}
        </ul>
      </div>
    </body>
  `

  function oninput (event) {
    if (event.code === 'Enter') {
      emit('sendChat', event.target.value)
      event.target.value = ''
    }
  }
}

const app = choo()
app.use(model)
app.use(conn)
app.use(logger)
app.router([
  ['/', mainView]
])
app.mount('body')

function logger (state, emitter) {
  emitter.on('*', function (messageName, data) {
    console.log('event', messageName, data)
  })
}
