import { readFile } from 'node:fs/promises';

const input = await readFile('input.txt', 'utf8');

const elves: number[][] = input.split('\n\n').map((elf: string) => elf.split('\n').map(Number));

const caloriesPerElf = elves.map((elf) => elf.reduce((total, meal) => total + meal));

console.log('Part 1:', caloriesPerElf.sort((a, b) => a - b).at(-1));
console.log(
  'Part 2:',
  caloriesPerElf
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((total, meal) => total + meal)
);
