/**
 * --- Day 3: Rucksack Reorganization ---
 * Part 1: 00:18:54   6815
 * Part 2: 00:26:36   5696
 */
import { readFile } from 'node:fs/promises';

// Input consists of strings representing the items in a sack being carried by an elf. Every character represents an item type.
const input: string = await readFile('input.txt', 'utf-8');

// Part 1 consists of finding items that appear in both the first and second half of a single sacks item list (representing multiple compartments in the sack)
const splitInHalf = (input: string) => {
  const half = input.length / 2;
  return [input.slice(0, half), input.slice(half)];
};

const sacks = input.split('\n').filter(Boolean).map(splitInHalf);

const getDuplicateItem = (compone: string, ...comps: string[]) => {
  for (const item of compone)
    if (comps.every((comp) => comp.includes(item))) return item;
  return '';
};

const chunkArray = <T>(arr: T[], maxSize: number): T[][] => {
  arr = [...arr];
  const output: T[][] = [];
  while (arr.length) output.push(arr.splice(0, maxSize));
  return output;
};

// Part 2 consists of finding items that appear in all 3 sacks of a group (every 3 lines is a new group)
const getBadges = (sacks: string[][]) => {
  const groups = chunkArray(
    sacks.map((comps) => comps.join('')),
    3,
  );
  return groups.map(([first, ...rest]) => getDuplicateItem(first, ...rest));
};

const getDuplicates = (sacks: string[][]) =>
  sacks.map((sack) => getDuplicateItem(sack[0], sack[1]));

// Items are assigned priorities, which are used to calculate the final answer, by adding up the priority scores of all items
const priorities = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const getPriority = (item: string) => priorities.indexOf(item) + 1;

console.log(
  'Part 1:',
  getDuplicates(sacks)
    .filter(Boolean)
    .map(getPriority)
    .reduce((a, b) => a + b),
);
console.log(
  'Part 2:',
  getBadges(sacks)
    .filter(Boolean)
    .map(getPriority)
    .reduce((a, b) => a + b),
);
