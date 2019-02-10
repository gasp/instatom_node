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
