function transcode(json) {
  const feed = [];
  try {
    const items = json.graphql.user.edge_owner_to_timeline_media.edges;
    for (let i = 0; i < items.length; i += 1) {
      let caption = '';
      if ((((items[i].node || {}).edge_media_to_caption || {}).edges || []).length) {
        caption = ((items[i].node.edge_media_to_caption.edges[0].node || {}).text || {});
      }

      const isoDate = new Date(items[i].node.taken_at_timestamp * 1000).toISOString();
      if (items[i].node.is_video === false) {
        feed.push({
          link: items[i].node.display_url, // wrong but will do
          created_time: `${isoDate.substring(0, 19)}Z`,
          thumbnail_url: items[i].node.display_url,
          caption,
          username: json.graphql.user.username,
          full_name: json.graphql.user.full_name,
        });
      }
    }
    return feed;
  } catch (e) {
    console.log('i2a err where', json, e);
    return [];
  }
}

module.exports = transcode;
