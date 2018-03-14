const express = require('express');
const request = require('request');
const redis = require('redis');

const i2a = require('../lib/instagramjson2atom');
const c = require('../config');

const router = express.Router();
const { redis: { namespace: ns }, cache: { time } } = c;

const red = redis.createClient({ port: c.redis.port, host: c.redis.host });
red.on('error', (err) => {
  console.log(`Error  ${err}`);
});

const emptyFeed = [{
  link: 'http://instagram.com/ryogasp',
  created_time: '2017-10-16T23:33:32Z',
  thumbnail_url: 'https://scontent-bru2-1.cdninstagram.com/t51.2885-15/s640x640/sh0.08/e35/22581849_1873072349384757_96953921725005824_n.jpg',
  caption: 'this profile is unavailable',
  username: 'ryogasp',
  full_name: 'error',
}];

/* GET users listing. */
router.get('/:username', (req, res) => {
  const { username } = req.params;
  red.get(ns + username, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.append('Source', 'redis');
      return res.render('feed', { feed: JSON.parse(result) });
    }
    return request(`https://instagram.com/${username}/?__a=1`, (error, response, body) => {
      if (error) {
        res.append('Exception', 'unreachable');
        red.setex(username, time * 4, JSON.stringify(emptyFeed));
        return res.render('feed', { feed: emptyFeed });
      }
      if (res.statusCode !== 200) {
        res.append('Exception', 'not200');
        red.setex(username, time * 4, JSON.stringify(emptyFeed));
        return res.render('feed', { feed: emptyFeed });
      }
      if (res.contentType !== 'application/json') {
        res.append('Exception', 'notjson');
        red.setex(username, time * 4, JSON.stringify(emptyFeed));
        return res.render('feed', { feed: emptyFeed });
      }
      let json = {};
      try {
        json = JSON.parse(body);
      } catch (e) {
        res.append('Exception', 'unparsable');
        red.setex(username, time * 10, JSON.stringify(emptyFeed));
        return res.render('feed', { feed: emptyFeed });
      }
      if (Object.prototype.hasOwnProperty.call(json.user, 'media') === false ||
        Object.prototype.hasOwnProperty.call(json.user.media, 'nodes') === false) {
        res.append('Exception', 'noitems');
        red.setex(username, time * 4, JSON.stringify(emptyFeed));
        return res.render('feed', { feed: emptyFeed });
      }
      const feed = i2a(json);
      red.setex(ns + username, time, JSON.stringify(feed));
      res.append('Source', 'instagram');
      return res.render('feed', {
        thumbnail_url: (feed.length) ? feed[0].thumbnail_url : '',
        username,
        feed,
      });
    });
  });
});

module.exports = router;
