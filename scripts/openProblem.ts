const year = process.argv[2];
const day = process.argv[3];

console.log('Opening text for day', day, 'of year', year);
Bun.spawnSync([
  'open',
  `https://adventofcode.com/${year}/day/${day.replace(/^0+/, '')}`,
]);
