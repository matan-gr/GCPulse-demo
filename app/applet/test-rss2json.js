async function test() {
  try {
    const response = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fchannel_id%3DUCJS9pqu9BzkAMNTmzNMNhvg");
    const data = await response.json();
    console.log(`Successfully fetched ${data.items.length} items`);
    console.log(data.items[0]);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
