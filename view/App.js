const html = require('bel')
const ChatMessages = require('./ChatMessages')

module.exports = function App (state, emit) {
  return html`
    <body class="vh-100">
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