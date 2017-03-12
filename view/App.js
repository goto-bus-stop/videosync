const html = require('bel')
const css = require('sheetify')
const ChatMessages = require('./ChatMessages')
const Video = require('./Video')

const video = Video()

const prefix = css`
  :host > .video {
    height: calc(100% - 1.625rem);
  }
`

module.exports = function App (state, emit) {
  const next = state.queue[0]
  return html`
    <body class="vh-100">
      <div class="fl w-75 h-100 ${prefix}">
        <div class="pv1 ph2 bg-dark-gray white">
          <strong>Next Up:</strong>
          ${next ? `${next.url} (${state.users[next.user].name})` : 'Nothing!'}
        </div>
        <div class="video h-100">
          ${video(state.video, emit)}
        </div>
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
