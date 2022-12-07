/**
 * --- Day 7: No Space Left On Device ---
 * Part 1: 01:34:17   9506
 * Part 2: 01:42:11   8772
 * This challenge is about analyzing the file system of a device to free up space for a firmware update.
 */

import { readFile } from 'node:fs/promises';

// input consists of terminal commands and the response
const input: string = await readFile('input.txt', 'utf-8');
const commandLines = input.split('\n');

const MAX_MEMORY = 70_000_000;
const NEEDED_FREE_SPACE = 30_000_000;

// Here we iterate through the commands and response to rebuild the structure of the file system
const buildFS = (commandLines: string[]) => {
  const fs = { parent: null };
  let current = fs;
  for (const line of commandLines) {
    const [type, name, path] = line.split(' ');
    if (type === '$' && name === 'cd') {
      if (path === '..') current = current?.parent ?? current;
      else if (path !== '/') {
        current[path] = current[path] ?? { parent: current };
        current = current[path];
      }
    }
    if (type === 'dir') current[name] = current[name] ?? { parent: current };
    if (/^\d+$/.test(type)) current[name] = type;
  }
  return fs;
};

// Here we calculate the sizes of all the directories and return it as a flat object
const calculateDirectorySizes = (
  fs: Record<string, unknown>
): Record<string, number> => {
  const sizes: Record<string, number> = {};
  const calculateSize = (
    node: string | Record<string, string>,
    prefix: string
  ) => {
    if (typeof node === 'string') return parseInt(node);
    sizes[`${prefix}`] = Object.entries(node)
      .map(([name, value]) => {
        if (name === 'parent') return 0;
        return calculateSize(value, `${prefix}/${name}`);
      })
      .reduce(sum);
    return sizes[`${prefix}`];
  };

  calculateSize(fs, '');
  return sizes;
};

const fsSizes = calculateDirectorySizes(buildFS(commandLines));

// Part 1 consists of finding all directories with a size under 100_000 and summing them
console.log(
  'Part 1:',
  Object.values(fsSizes).filter(underHundredThousand).reduce(sum)
);
// Part 2 consists of finding the smallest single directory whose deletion would free up enough space to allow for the update
console.log(
  'Part 2:',
  Object.values(fsSizes)
    .filter((size) => size >= NEEDED_FREE_SPACE - (MAX_MEMORY - fsSizes['']))
    .reduce(getSmallestSize)
);

function sum(a: number, b: number) {
  return a + b;
}

function underHundredThousand(size: number) {
  return size < 100_000;
}

function getSmallestSize(last: number, next: number) {
  return last < next ? last : next;
}
