const https = require('https')

function getJSON(rawBuff) {
  const rawPage = rawBuff.toString('utf8')
  const m = rawPage.match(/window._sharedData =(.*?)<\/script>/)
  if (!(m && m.length)) {
    throw new Error('no match found in html, user may not be available')
  }

  const json = m[0].substring(
    'window._sharedData = '.length,
    m[0].length - ';</script>'.length
  )
  const rawUser = JSON.parse(json).entry_data.ProfilePage[0].graphql.user
  const rawPosts = rawUser.edge_owner_to_timeline_media.edges

  const user = {
    biography: rawUser.biography,
    full_name: rawUser.full_name,
    username: rawUser.username
  }
  const posts = rawPosts.map(post => ({
    created_time: new Date(post.node.taken_at_timestamp * 1000).toISOString(),
    src: post.node.display_url,
    is_video: post.node.is_video,
    caption:
      post.node.edge_media_to_caption &&
      post.node.edge_media_to_caption.edges.length
        ? post.node.edge_media_to_caption.edges[0].node.text
        : ''
  }))

  return {
    posts,
    user
  }
}

function fetch(username) {
  let buff = Buffer.alloc(70000)
  return new Promise((resolve, reject) => {
    https
      .get(`https://www.instagram.com/${username}/`, res => {
        if (res.statusCode != 200) {
          reject('statuscode != 200')
        }

        res.on('data', d => {
          buff += d
        })

        res.on('end', () => {
          try {
            const json = getJSON(buff)
            resolve(json)
          } catch (err) {
            reject(err)
          }
        })
      })
      .on('error', err => {
        reject(err)
      })
  })
}

module.exports = fetch
