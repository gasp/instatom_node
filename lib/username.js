function check(username) {
  return username.length > 0 && username.length < 25
}

module.exports = check
