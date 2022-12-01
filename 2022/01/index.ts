import { readFile } from 'node:fs/promises';

const input = await readFile('input.txt', 'utf8');

const elves: number[][] = input.split('\n\n').map((elf: string) => elf.split('\n').map(Number));

const caloriesPerElf = elves.map((elf) => elf.reduce((total, meal) => total + meal)).sort((a, b) => b - a);

console.log('Part 1:', caloriesPerElf[0]);
console.log(
  'Part 2:',
  caloriesPerElf.slice(0, 3).reduce((total, meal) => total + meal)
);
