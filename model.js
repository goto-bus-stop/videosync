const users = {}

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

exports.users = users
exports.setUserName = setUserName
