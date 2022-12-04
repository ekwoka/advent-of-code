import { readFile } from 'node:fs/promises';

const input: string = await readFile('input.txt', 'utf-8');

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

const getBadges = (sacks: string[][]) => {
  const groups = chunkArray(
    sacks.map((comps) => comps.join('')),
    3
  );
  return groups.map(([first, ...rest]) => getDuplicateItem(first, ...rest));
};

const getDuplicates = (sacks: string[][]) =>
  sacks.map((sack) => getDuplicateItem(sack[0], sack[1]));

const priorities = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const getPriority = (item: string) => priorities.indexOf(item) + 1;

console.log(
  'Part 1:',
  getDuplicates(sacks)
    .filter(Boolean)
    .map(getPriority)
    .reduce((a, b) => a + b)
);
console.log(
  'Part 2:',
  getBadges(sacks)
    .filter(Boolean)
    .map(getPriority)
    .reduce((a, b) => a + b)
);
