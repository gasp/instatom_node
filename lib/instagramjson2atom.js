function transcode(json) {
  const feed = [];
  try {
    const { items } = json;
    for (let i = 0; i < items.length; i += 1) {
      const caption = (items[i].caption === null) ? '' : items[i].caption.text;
      const isoDate = new Date(items[i].created_time * 1000).toISOString();
      feed.push({
        link: items[i].link,
        created_time: `${isoDate.substring(0, 19)}Z`,
        thumbnail_url: items[i].images.standard_resolution.url,
        caption,
        username: items[i].user.username,
        full_name: items[i].user.full_name,
      });
    }
    return feed;
  } catch (e) {
    console.log(e);
    return [];
  }
}

module.exports = transcode;
