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
        <div class="w-100 h-100">
          <video
            autoplay
            controls
            class="video-js w-100 h-100">
          </video>
        </div>
      `
    },

    onload: (el) => {
      player = videojs(el.firstElementChild, {
        techOrder: techs.techOrder,
        sources: [
          source
        ]
      })
    },

    onupdate: (el, video) => {
      source = techs.getSource(video.url)

      player.src([
        source
      ])
    }
  })
}
