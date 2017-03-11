const choo = require('choo')
const html = require('bel')
const model = require('./model')
const connect = require('./connect')

const conn = connect(prompt('Your name'))

const mainView = (state, emit) => html`
  <body>
    <h1>Hello world</h1>
    <ul>
      ${Object.entries(state.users).map(([ id, { name } ]) => html`
        <li>${name}</li>
      `)}
    </ul>
    <div>
      ${state.chat.map((message) => html`
        <p>
          <strong>${state.users[message.sender].name}</strong>
          ${message.message}
        </p>
      `)}
    </div>
  </body>
`

const app = choo()
app.use(conn)
app.use(model)
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
