const express = require('express');
const router = express.Router();
const i2a = require('../lib/instagramjson2atom');
var request = require('request');

/* GET users listing. */
router.get('/:username', function(req, res, next) {
  request('https://instagram.com/' + req.params.username + '/media', function (error, response, body) {
    if (error) {
      return res.send('unreachable');
    }
    let json = {}
    try {
      json = JSON.parse(body)
    } catch (e) {
      return res.send('unparsable');
    }
    return res.render('feed', {feed: i2a(json)});
  });
});

module.exports = router;
