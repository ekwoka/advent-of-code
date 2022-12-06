/**
 * --- Day 1: Calorie Counting ---
 * Part 1: 01:06:24  13653
 * Part 2: 01:07:47  12697
 */

import { readFile } from 'node:fs/promises';

// Input consists of lines of numbers representing the calories of each meal being carried by the elves, empty lines between groups of numbers indicates a new elf's collection of meals
const input = await readFile('input.txt', 'utf8');

const elves: number[][] = input
  .split('\n\n')
  .map((elf: string) => elf.split('\n').map(Number));

const caloriesPerElf = elves
  .map((elf) => elf.reduce((total, meal) => total + meal))
  .sort((a, b) => b - a);

// Part 1 consists of identifying the single elf with the most calories in their collection of meals
console.log('Part 1:', caloriesPerElf[0]);

// Part 2 consists of identifying the top 3 elves with the most calories in their collection of meals, and summing their calories
console.log(
  'Part 2:',
  caloriesPerElf.slice(0, 3).reduce((total, meal) => total + meal)
);
