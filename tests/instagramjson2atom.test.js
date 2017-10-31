const instagramjson2atom = require('../lib/instagramjson2atom');
const jsonString = require('./mock.json');

describe('instagram2json', () => {
  const json = instagramjson2atom(jsonString);
  it('parses all', () => {
    expect(json.length).toBe(20);
  })
  it('has all elements', () => {
    expect(Object.keys(json[0])).toEqual(['link','created_time','thumbnail_url','caption','username','full_name']);
  })
});