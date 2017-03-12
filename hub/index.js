/**
 * Small wrapper around signalhub to make it work with now.sh.
 */

const http = require('http')
const signalhub = require('signalhub/server')

const hub = signalhub()
const server = http.createServer((req, res) => {
  res.setHeader('x-accel-buffering', 'no')
  hub.emit('request', req, res)
})

server.on('close', () => hub.emit('close'))

server.listen(process.env.PORT || 80)
