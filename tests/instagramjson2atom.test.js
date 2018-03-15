const instagramjson2atom = require('../lib/instagramjson2atom');
const jsonString = require('./mock.json');

describe('instagram2json', () => {
  const json = instagramjson2atom(jsonString);
  const empty = {
    json: {
      graphql: {
        user: {
          edge_owner_to_timeline_media: {
            edges: [],
          },
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
  it('fails elegantly', () => {
    expect(error).toEqual([]);
  });
});
