module.exports = {
  services: {
    pmx: false, // disable pmx
    redis: true, // enable redis
  },
  redis: {
    host: 'localhost',
    port: 6379,
    namespace: 'instatom:',
  },
  cache: {
    time: 60 * 60 * 12, // basic cache time, 12 hours
  },
};
