async function main() {
  const res = await fetch('https://www.youtube.com/feeds/videos.xml?channel_id=UC_x5XG1OV2P6uZZ5FSM9Ttw');
  const xml = await res.text();
  console.log(xml.substring(0, 2000));
}
main();
