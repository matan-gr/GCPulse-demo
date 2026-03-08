import Parser from "rss-parser";

const parser = new Parser({
  customFields: {
    item: [
      ['media:group', 'mediaGroup'],
      ['yt:videoId', 'videoId'],
      ['yt:channelId', 'channelId'],
      ['author', 'author'],
    ]
  }
});

async function test() {
  try {
    const feed = await parser.parseURL("https://www.youtube.com/feeds/videos.xml?channel_id=UCJS9pqu9BzkAMNTmzNMNhvg");
    console.log(`Successfully fetched ${feed.items.length} items`);
    console.log(feed.items[0]);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
