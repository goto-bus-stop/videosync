const users = {}
const chat = []

function setUserData (id, obj) {
  if (!users[id]) {
    users[id] = obj
    return obj
  }

  return Object.assign(users[id], obj)
}

function setUserName (id, name) {
  return setUserData(id, { name })
}

function receiveChat (sender, message) {
  chat.push({ sender, message })
}

exports.users = users
exports.chat = chat
exports.setUserName = setUserName
exports.receiveChat = receiveChat
