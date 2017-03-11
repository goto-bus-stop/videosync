require('videojs-youtube')
require('videojs-vimeo')

exports.techOrder = [
  'youtube',
  'vimeo'
]

exports.getSource = (url) => {
  if (/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/.test(url)) {
    return { type: 'video/youtube', src: url }
  }

  if (/^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/.test(url)) {
    return { type: 'video/vimeo', src: url }
  }

  return { src: url }
}
