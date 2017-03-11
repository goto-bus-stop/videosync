const choo = require('choo')
const html = require('bel')
const css = require('sheetify')
const model = require('./model')
const connect = require('./connect')
const App = require('./view/App')

css('tachyons')

const conn = connect(prompt('Your name'))

const app = choo()
app.use(model)
app.use(conn)
app.use(logger)
app.router([
  ['/', App]
])
app.mount('body')

function logger (state, emitter) {
  emitter.on('*', function (messageName, data) {
    console.log('event', messageName, data)
  })
}
