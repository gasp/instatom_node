/* global it, describe, expect */
const instagramjson2atom = require('../lib/instagramjson2atom');
const jsonString = require('./mock.json');

describe('instagram2json', () => {
  const json = instagramjson2atom(jsonString);
  const empty = {
    graphql: {
      user: {
        username: 'some_username',
        edge_owner_to_timeline_media: {
          edges: [],
        },
      },
    },
  };
  const outputFields = ['link', 'created_time', 'thumbnail_url', 'caption', 'username', 'full_name'];

  const error = instagramjson2atom(empty);
  it('parses all', () => {
    expect(json.length).toBe(12);
  });
  it('has all elements', () => {
    expect(Object.keys(json[0])).toEqual(outputFields);
  });
  it('has correct title', () => {
    expect(json[5].caption).toBe('From the window of CCK');
    expect(json[7].caption).toBe('\ud83d\udc08\ud83c\udf4a');
  });
  it('has correct name', () => {
    expect(json[5].full_name).toBe('Gaspard');
    expect(json[7].username).toBe('ryogasp');
  });
  it('has correct date', () => {
    expect(json[5].created_time).toBe('2017-04-27T14:32:44Z');
  });
  it('has correct files', () => {
    expect(json[5].thumbnail_url).toMatch(/^https/);
    expect(json[5].link).toMatch(/_n\.jpg$/);
  });
  it('fails elegantly', () => {
    expect(error).toEqual([]);
  });
});
