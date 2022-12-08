import { readFile } from 'node:fs/promises';

const input: string = await readFile('input.txt', 'utf-8');

const grid = input
  .split('\n')
  .filter(Boolean)
  .map((line) => line.split('').filter(Boolean).map(Number));

const getSightLines = (x: number, y: number, grid: number[][]) => {
  const horizontal = [grid[y].slice(x + 1), grid[y].slice(0, x).reverse()];
  const vertical = [
    grid.slice(y + 1).map((row) => row[x]),
    grid
      .slice(0, y)
      .map((row) => row[x])
      .reverse(),
  ];
  return [horizontal, vertical];
};

const part1 = (grid: number[][]) => {
  const areVisible = grid.flatMap((row, y) =>
    row.filter((tree, x) => {
      if ([0, row.length - 1].includes(x)) return true;
      if ([0, grid.length - 1].includes(y)) return true;
      return getSightLines(x, y, grid)
        .flat()
        .some((line) => line.every((cell) => cell < tree));
    })
  );
  return areVisible.length;
};
const part2 = (grid: number[][]) => {
  const scenicScores = grid.flatMap((row, y) =>
    row.map((tree, x) => {
      const sightLines: number[][] = getSightLines(x, y, grid).flat();
      const ranges = sightLines.map((line) => {
        const range = line.findIndex((cell) => cell >= tree);
        return range === -1 ? line.length : range + 1;
      });
      return ranges.reduce((a, b) => a * b);
    })
  );
  return Math.max(...scenicScores);
};

console.log('Part 1:', part1(grid));
console.log('Part 2:', part2(grid));
