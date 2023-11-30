/**
 * --- Day 1: Calorie Counting ---
 * Part 1: 01:06:24  13653
 * Part 2: 01:07:47  12697
 */

import { getInput } from '../../utils';

// Input consists of lines of numbers representing the calories of each meal being carried by the elves, empty lines between groups of numbers indicates a new elf's collection of meals
const input = await getInput(2022, 1);

const elves = input.splitBy('\n\n').map((elf) => elf.lines().map(Number));

const caloriesPerElf = elves
  .map((elf) => elf.reduce((total, meal) => total + meal))
  .sort((a, b) => b - a)
  .peekable();

// Part 1 consists of identifying the single elf with the most calories in their collection of meals
console.log('Part 1:', caloriesPerElf.peek().value);

// Part 2 consists of identifying the top 3 elves with the most calories in their collection of meals, and summing their calories
console.log(
  'Part 2:',
  caloriesPerElf.take(3).reduce((total, meal) => total + meal),
);
