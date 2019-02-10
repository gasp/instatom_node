// try to get feed from redis or fetch

const fetch = require('../lib/fetch')
const redis = require('../lib/redis')

const emptyFeed = {
  posts: [],
  user: {
    biography: '',
    full_name: 'Unknown user',
    username: 'nobody'
  }
}

async function get(username) {
  // let source = null
  // const redis = await redis.get(username);
  try {
    const cached = await redis.get(username)
    const feed = cached || await fetch(username)
    if(!cached) {
      const setex = await redis.setex(username, feed)
    }
    return {
      source: cached ? 'cached' : 'fetched',
      error: null,
      feed
    }
  } catch (err) {
    return {
      source: 'none',
      error: err,
      feed: emptyFeed
    }
  }
}

module.exports = { get }
