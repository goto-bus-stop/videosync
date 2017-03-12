const html = require('bel')
const widget = require('cache-element/widget')
const videojs = require('video.js')
const techs = require('../techs')

module.exports = function Video () {
  let player
  let source
  let playButton
  let pauseButton

  return widget({
    render: (video, emit) => {
      source = techs.getSource(video.url)

      playButton = html`
        <button onclick=${play}>
          ►
        </button>
      `
      pauseButton = html`
        <button onclick=${pause}>
          ⏸
        </button>
      `

      return html`
        <div class="w-100 h-100 relative hide-child">
          <video
            autoplay
            controls
            class="video-js w-100 h-100">
          </video>
          <div class="absolute bottom-0 left-0 child black bg-lightest-blue">
            ${playButton}
            ${pauseButton}
          </div>
        </div>
      `

      function play () {
        emit('resume', { time: player.currentTime() })
      }
      function pause () {
        emit('pause')
      }
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
      if (video.url !== source.url) {
        source = techs.getSource(video.url)

        player.src([
          source
        ])
      }

      if (video.paused && !player.paused()) {
        player.pause()

        pauseButton.setAttribute('hidden', 'hidden')
        playButton.removeAttribute('hidden', 'hidden')
      } else if (!video.paused && player.paused()) {
        if (video.continueAt) {
          player.currentTime(video.continueAt)
        }
        player.play()

        playButton.setAttribute('hidden', 'hidden')
        pauseButton.removeAttribute('hidden', 'hidden')
      }
    }
  })
}
