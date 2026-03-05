async function main() {
  const res = await fetch("https://inv.tux.pizza/api/v1/videos/y4LEGj0gG4E");
  const data = await res.json();
  console.log(data.lengthSeconds);
}
main();
