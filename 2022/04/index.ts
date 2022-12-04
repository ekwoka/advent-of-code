import { readFile } from 'node:fs/promises';

const input: string = await readFile('input.txt', 'utf-8');

const pairs = input.split('\n').filter(Boolean);

const assignments = pairs.map((pair) =>
  pair.split(`,`).map((room) => room.split(`-`).map(Number))
);

const pointInRange = (point: number, range: [number, number]) =>
  point >= range[0] && point <= range[1];

const rangeInRange = (range: [number, number], range2: [number, number]) =>
  (range[0] <= range2[0] && range[1] >= range2[1]) ||
  (range[0] >= range2[0] && range[1] <= range2[1]);

console.log(
  'Part 1:',
  assignments.filter((groups) =>
    rangeInRange(...(groups as [[number, number], [number, number]]))
  ).length
);

console.log(
  'Part 2:',
  assignments.filter((groups) => {
    const output = groups[0].some(
      (room) =>
        pointInRange(room, groups[1] as [number, number]) ||
        rangeInRange(...(groups as [[number, number], [number, number]]))
    );
    return output;
  }).length
);
