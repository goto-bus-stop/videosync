const choo = require('choo')
const html = require('bel')
const css = require('sheetify')
const model = require('./model')
const connect = require('./connect')
const ChatMessages = require('./view/ChatMessages')

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

const mainView = (state, emit) => {
  return html`
    <body class="${prefix} vh-100">
      <div class="fl w-75 h-100 ph2">
        <h1>Video here</h1>
      </div>
      ${ChatMessages(state, emit)}
      <div class="users w-25 dn">
        <ul class="list">
          ${Object.entries(state.users).map(([ id, { name } ]) => html`
            <li>${name}</li>
          `)}
        </ul>
      </div>
    </body>
  `
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
