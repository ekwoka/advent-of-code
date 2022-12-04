// Pathfinding Algorith. This one actually works, using a priority queue to prioritize those next options based on if they are already a low cost path. This reduces the need to reprocess existing cells.

// import input from './input.mjs'

const input = [
  '1163751742',
  '1381373672',
  '2136511328',
  '3694931569',
  '7463417111',
  '1319128137',
  '1359912421',
  '3125421639',
  '1293138521',
  '2311944581',
];

const GRID = input.map((row) => row.split('').map(Number));

const OFFSETS = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
];

const START = [0, 0];
const startValue = 0 - GRID[0][0];

const queue = {
  q: [],
  add(x, y, sum) {
    if (sum === undefined) return console.log('Invalid sum');
    if (this.q.length == 0) return this.q.push([x, y, sum]);
    let insertion = this.q.findIndex((e) => e[2] < sum);
    if (insertion == -1) insertion = this.q.length;
    this.q.splice(insertion, 0, [x, y, sum]);
  },
  pop() {
    return this.q.pop();
  },
};

function task1(grid, height, width) {
  [height, width] = [height || grid.length, width || grid[0].length];
  queue.add(...START, startValue);
  let costs = Array.from(Array(height), () => Array(width).fill(undefined));
  let maxQ = queue.q.length;
  let operations = 0;
  console.time('Operation Time');
  while (queue.q.length) {
    maxQ = Math.max(maxQ, queue.q.length);
    if (operations % 10000 === 0) {
      console.clear();
      console.log(
        'Percentage Complete:',
        (1000 - Math.floor((queue.q.length / maxQ) * 1000)) / 10,
        '% of',
        operations + maxQ
      );
      console.log('Remaining Operations:', queue.q.length);
    }
    let [x, y, sum] = queue.pop();

    let adjustment =
      Math.floor(x / grid[0].length) + Math.floor(y / grid.length);
    let cell = grid[y % grid.length][x % grid[0].length] + adjustment;
    cell = cell > 9 ? cell - 9 : cell;
    operations++;
    let newSum = sum + cell;
    if (!costs[y][x] || newSum < costs[y][x]) {
      costs[y][x] = newSum;
      OFFSETS.forEach(([dx, dy]) => {
        let newX = x + dx;
        let newY = y + dy;
        if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
          queue.add(newX, newY, newSum);
        }
      });
    }
  }
  console.clear();
  console.log('Percentage Complete: 100%');
  console.log('Total Operations:', operations);
  console.log('Max Q:', maxQ);
  console.timeEnd('Operation Time');

  return costs.at(-1).at(-1);
}

console.log(task1(GRID, GRID.length * 5, GRID[0].length * 5));
