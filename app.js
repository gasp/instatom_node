const Koa = require('koa')
const route = require('koa-route')

const view = require('./lib/view.js')
const check = require('./lib/username.js')
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
    let inc = 0;
    req.on('data', chunk => {
      body += chunk.toString()
      if (inc > 2) reject()
      inc ++
    })
    req.on('end', () => {
      const username = String(body).substring(9)
      if (check(username)) resolve(username)
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
      ctx.throw(406, 'please submit a username')
    }
  })
)

app.use(
  route.get('/:name', async (ctx, username) => {
    if (!check(username)) return ctx.throw(406, 'please submit a username')
    const {error, feed, source} = await feedController.get(username)
    if (error) ctx.throw(404, `error viewing user ${username}`)
    ctx.response.set('X-Source', source)
    ctx.response.body = view.render('feed', feed)
  })
)

app.listen(4032)
console.log('listening on port 4032')
