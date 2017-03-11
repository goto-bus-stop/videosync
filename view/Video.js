const html = require('bel')
const widget = require('cache-element/widget')
const videojs = require('video.js')
const techs = require('../techs')

module.exports = function Video () {
  let player
  let source

  return widget({
    render: (video) => {
      source = techs.getSource(video.url)
      return html`
        <div>
          <video autoplay controls></video>
        </div>
      `
    },

    onload: (el) => {
      console.log('onload')
      player = videojs(el.firstElementChild, {
        techOrder: ['youtube'],
        sources: [source],
        youtube: {
          ytControls: 2
        }
      })
    },

    onupdate: (el, video) => {
      console.log('update', techs.getSource(video.url))
      player.src([
        source = techs.getSource(video.url)
      ])
    }
  })
}
