const express = require('express');
const router = express.Router();
const i2a = require('../lib/instagramjson2atom');
const request = require('request');

const probe = require('pmx').probe();


const meter = probe.meter({
  name: 'req/sec',
  samples: 1,
  timeframe: 60
});

const unparsable = probe.meter({
  name: 'unparsable/sec',
  sample: 1,
  timeframe: 60
});

const unreachable = probe.meter({
  name: 'unreachable/sec',
  sample: 1,
  timeframe: 60
});

const fetchlatency = probe.histogram({
  name: 'fetch latency',
  measurement: 'mean'
});

const parselatency = probe.histogram({
  name: 'parse latency',
  measurement: 'mean'
});


/* GET users listing. */
router.get('/:username', function(req, res, next) {
  const startTime = new Date();
  meter.mark();
  request('https://instagram.com/' + req.params.username + '/media', function (error, response, body) {
    const fetchTime = new Date();
    fetchlatency.update(fetchTime.getTime() - startTime.getTime());

    if (error) {
      unreachable.mark();
      return res.send('unreachable');
    }
    let json = {}
    try {
      json = JSON.parse(body)
    } catch (e) {
      unparsable.mark();
      return res.send('unparsable');
    }
    const endTime = new Date();
    parselatency.update(endTime.getTime() - fetchTime.getTime());
    if (typeof json.items !== 'undefined' && json.items.length === 0) {
      return res.send('inexistan, empty or private');
    }
    return res.render('feed', {feed: i2a(json)});
  });
});

module.exports = router;
