const redis = require('redis')

const c = require('../config.js')
const red = redis.createClient({port: c.redis.port, host: c.redis.host})

const {
  redis: {namespace: ns},
  cache: {time}
} = c

red.on('error', err => {
  console.log(`Error  ${err}`)
})

function get(username) {
  return new Promise((resolve, reject) => {
    red.get(`${ns}${username}`, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(JSON.parse(result))
    })
  })
}

function setex(username, feed) {
  return new Promise((resolve, reject) => {
    console.log('set', username)
    red.setex(
      `${ns}${String(username)}`,
      time,
      JSON.stringify(feed),
      (err, ok) => {
        if (err) {
          return reject(err)
        }
        resolve()
      }
    )
  })
}

module.exports = {get, setex}
