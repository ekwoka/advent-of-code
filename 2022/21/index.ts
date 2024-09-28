/**
 * --- Day 21: Monkey Math ---
 * Part 1: 00:14:11   1364
 * Part 2: 01:01:47   1883
 * Some interesting working with numbers and arbitrary math
 */
import { readFile } from 'node:fs/promises';

// input consists of string of monkey names and either a number or an operation the monkey will perform
const input: string = (await readFile('input.txt', 'utf8')).trim();

// Part one consists of determining what the `root` monkey will output. I think I was quite inventive with this solution to use the Function constructor and the `with` keyword to allow this to evaluate naturally.
const monkeysOne: number = input
  .split('\n')
  .map((string) => {
    const [name, operation] = string.split(':');
    return [name, operation];
  })
  .reduce(
    (acc, [name, operation]) => {
      const getter = new Function(
        'monkeys',
        `with (monkeys) { return ${operation}; }`,
      );
      return Object.defineProperty(acc, name, {
        get() {
          return getter(acc);
        },
        enumerable: true,
      });
    },
    {} as Record<string, number>,
  );

// Part 2 consists of finding out which number to provide to `humn` for `root` to evaluate as both inputs being true. This is mainly just brute forced but with some modifications to use the output from the last check to determine closeness to modify the input for the next.
const monkeysTwo: number = input
  .split('\n')
  .map((string) => {
    const [name, operation] = string.split(':');
    return [name, operation];
  })
  .reduce(
    (acc, [name, operation]) => {
      if (name === 'humn') return acc;
      const getter = new Function(
        'monkeys',
        `with (monkeys) { return ${
          name === 'root' ? operation.replace('+', '-') : operation
        }; }`,
      );
      return Object.defineProperty(acc, name, {
        get() {
          return getter(acc);
        },
        enumerable: true,
      });
    },
    {} as Record<string, number | boolean>,
  );

// There was a positive relationship between the input and output so it was pretty simple to just run the operations and adjust along the graph.
const getPartTwo = () => {
  let current = 0;
  let result = null;
  while (!result) {
    monkeysTwo.humn = current;
    const output = monkeysTwo.root;
    if (output === 0) {
      result = current;
      break;
    }
    const mod = Math.ceil(output / 10);
    current = current + mod;
    if (
      current === Number.POSITIVE_INFINITY ||
      current === Number.NEGATIVE_INFINITY
    )
      return false;
  }
  return result;
};

wrapInTime(() => {
  console.log('Part One:', monkeysOne.root);
});
wrapInTime(() => {
  console.log('Part Two:', getPartTwo());
});

function wrapInTime(fn: () => void) {
  const start = Date.now();
  fn();
  const end = Date.now();
  console.log(`Time: ${end - start}ms`);
}
