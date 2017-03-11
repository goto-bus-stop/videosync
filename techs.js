require('videojs-youtube')

exports.getSource = (url) => {
  if (/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/.test(url)) {
    return { type: 'video/youtube', src: url }
  }

  return { src: url }
}
