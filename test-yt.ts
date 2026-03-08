import Parser from 'rss-parser';
const parser = new Parser();

async function run() {
  try {
    // Google Developers channel
    const response = await fetch('https://www.youtube.com/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Status code ${response.status}`);
    }
    
    const xml = await response.text();
    const feed = await parser.parseString(xml);
    console.log("ID:", feed.items[0].id);
    console.log("LINK:", feed.items[0].link);
  } catch (error) {
    console.error("Error fetching feed:", error);
  }
}
run();
