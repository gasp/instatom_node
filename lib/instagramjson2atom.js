function transcode(json) {
  const feed = [];
  try {
    const items = json.user.media.nodes;
    for (let i = 0; i < items.length; i += 1) {
      const caption = (items[i].caption === null) ? '' : items[i].caption;
      const isoDate = new Date(items[i].date * 1000).toISOString();
      if (items[i].is_video === false) {
        feed.push({
          link: items[i].link,
          created_time: `${isoDate.substring(0, 19)}Z`,
          thumbnail_url: items[i].display_src,
          caption,
          username: json.user.username,
          full_name: json.user.full_name,
        });
      }
    }
    return feed;
  } catch (e) {
    console.log(e);
    return [];
  }
}

module.exports = transcode;
