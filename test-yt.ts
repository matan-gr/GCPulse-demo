import Parser from 'rss-parser';
const parser = new Parser();
async function run() {
  const feed = await parser.parseURL('https://www.youtube.com/feeds/videos.xml?channel_id=UCJS9pqu9BzkAMNTmzNMNhvg');
  console.log("ID:", feed.items[0].id);
  console.log("LINK:", feed.items[0].link);
}
run();
