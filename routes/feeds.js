const express = require('express');
const request = require('request');
const redis = require('redis');

const i2a = require('../lib/instagramjson2atom');
const c = require('../config');

const router = express.Router();

const { redis: { namespace: ns }, cache: { time } } = c;

const probe = require('pmx').probe();

const red = redis.createClient({ port: c.redis.port, host: c.redis.host });
red.on('error', (err) => {
  console.log(`Error  ${err}`);
});

const traffic = probe.meter({
  name: 'req/sec',
  samples: 1,
  timeframe: 60,
});

const unparsable = probe.meter({
  name: 'unparsable/sec',
  sample: 1,
  timeframe: 60,
});

const unreachable = probe.meter({
  name: 'unreachable/sec',
  sample: 1,
  timeframe: 60,
});

const fetchlatency = probe.histogram({
  name: 'fetch latency',
  measurement: 'mean',
});

const parselatency = probe.histogram({
  name: 'parse latency',
  measurement: 'mean',
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
  const startTime = new Date();
  const { username } = req.params;
  traffic.mark();
  red.get(ns + username, (err, result) => {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.append('source', 'redis');
      return res.render('feed', { feed: JSON.parse(result) });
    }
    return request(`https://instagram.com/${username}/?__a=1`, (error, response, body) => {
      const fetchTime = new Date();
      fetchlatency.update(fetchTime.getTime() - startTime.getTime());

      if (error) {
        unreachable.mark();
        res.append('unreachable');
        red.setex(username, time * 4, JSON.stringify(emptyFeed));
        return res.render('feed', { feed: emptyFeed });
      }
      let json = {};
      try {
        json = JSON.parse(body);
      } catch (e) {
        unparsable.mark();
        res.append('unparsable');
        red.setex(username, time * 10, JSON.stringify(emptyFeed));
        return res.render('feed', { feed: emptyFeed });
      }
      const endTime = new Date();
      parselatency.update(endTime.getTime() - fetchTime.getTime());
      if (typeof json.items !== 'undefined' && json.items.length === 0) {
        return res.send('inexistan, empty or private');
      }
      const feed = i2a(json);
      red.setex(ns + username, time, JSON.stringify(feed));
      return res.render('feed', {
        thumbnail_url: (feed.length) ? feed[0].thumbnail_url : '',
        username,
        feed,
      });
    });
  });
});

module.exports = router;
