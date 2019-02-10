const pug = require('pug')

const templates = {
  feed: pug.compileFile('./views/feed.pug'),
  index: pug.compileFile('./views/index.pug')
}

function render(name, locals) {
  return templates[name] && templates[name](locals)
}

module.exports = {render}
