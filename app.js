const Koa = require('koa')
const route = require('koa-route')

const view = require('./lib/view.js')
const feedController = require('./controller/feed.js')

const app = new Koa()

app.use(
  route.get('/', ctx => {
    ctx.body = view.render('index', {title: 'instatom'})
  })
)

function bodyParser(req) {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      const username = String(body).substring(9)
      if(username.length) resolve(username)
      else reject()
    })
  })
}

app.use(
  route.post('/', async ctx => {
    try {
      const username = await bodyParser(ctx.req)
      ctx.redirect(`/${username}`)
    } catch (e) {
      ctx.response.body = 'please submit a username'
    }
  })
)

app.use(
  route.get('/:name', async (ctx, username) => {
    const {error, feed, source} = await feedController.get(username)
    if (error) {
      ctx.response.status = 404
      ctx.response.body = `error viewing user ${username}`
    }
    ctx.response.set('X-Source', source)
    ctx.response.body = view.render('feed', feed)
  })
)

app.listen(4032)
console.log('listening on port 4032')
