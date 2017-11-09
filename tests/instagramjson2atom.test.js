const instagramjson2atom = require('../lib/instagramjson2atom');
const jsonString = require('./mock.json');

describe('instagram2json', () => {
  const json = instagramjson2atom(jsonString);
  const error = instagramjson2atom({user:{media:{nodes:[]}}});
  it('parses all', () => {
    expect(json.length).toBe(12);
  });
  it('has all elements', () => {
    expect(Object.keys(json[0])).toEqual(['link','created_time','thumbnail_url','caption','username','full_name']);
  });
  it('fails elegantly', () => {
    expect(error).toEqual([]);
  });
});
