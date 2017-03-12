const html = require('bel')
const widget = require('cache-element/widget')
const videojs = require('video.js')
const techs = require('../techs')

const buttonClass = 'pointer bg-white hover-bg-light-pink b--dark-pink br2 ba mh2 ph2'

module.exports = function Video () {
  let player
  let source
  let playButton
  let pauseButton
  let _emit

  return widget({
    render: (video, emit) => {
      _emit = emit
      source = techs.getSource(video.url)

      playButton = html`
        <button class=${buttonClass} onclick=${play}>
          ►
        </button>
      `
      pauseButton = html`
        <button class=${buttonClass} onclick=${pause}>
          ⏸
        </button>
      `

      return html`
        <div class="w-100 h-100 relative hide-child">
          <video autoplay class="video-js w-100 h-100"></video>
          <div class="absolute w-100 h-100 top-0 left-0">
            <!-- Prevent clicks -->
          </div>
          <div class="absolute bottom-0 left-0 child black pv1">
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

      _emit('player', player)

      player.on('ended', () => {
        _emit('nextVideo')
      })
    },

    onupdate: (el, video) => {
      if (video.url !== source.url) {
        source = techs.getSource(video.url)

        player.src([
          source
        ])
        if (video.continueAt) {
          player.currentTime(video.continueAt)
        }
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
