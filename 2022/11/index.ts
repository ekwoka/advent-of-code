/**
 * --- Day 11: Monkey in the Middle ---
 * Part 1: 00:30:36   1795
 * Part 2: 02:17:43   6645
 *
 * This was a bit of a challenge for part 2, as the numbers you're working on get rather huge.
 */

import { readFile } from 'node:fs/promises';

const input: string = await readFile('input.txt', 'utf8');

// The input is a bit complicated, but here we parse the starting state into new objects with all our needed info
const monkeys = () =>
  input
    .split('\n\n')
    .filter(Boolean)
    .map((monkeyData) => {
      const [_monkey, items, operationString, test, truthy, falsey] = monkeyData
        .split('\n')
        .map((line) =>
          line
            .trim()
            .split(':')
            .map((part) => part.trim())
        );
      return {
        items: items[1]
          .split(',')
          .map((item) => Number(item.trim()))
          .filter(Boolean),
        operation: new Function(
          'old',
          `return ${operationString[1].split('=')[1]}`
        ) as (old: number) => number,
        test: Number(test[1].match(/\d+/g)?.[0] ?? 0),
        trueTarget: truthy[1].match(/\d+/g)?.map(Number)[0] ?? 0,
        falseTarget: falsey[1].match(/\d+/g)?.map(Number)[0] ?? 0,
        inpections: 0,
      };
    });

// In a round, we cycle through each item, update it's value, test it, and send it to another monkey
const processRound = (
  monkeyGroup: ReturnType<typeof monkeys>,
  relief = 1,
  modulo: number
) => {
  for (const monkey of monkeyGroup) {
    while (monkey.items.length) {
      const item =
        (monkey.operation(monkey.items.shift() ?? 0) / Number(relief)) % modulo;
      monkey.inpections++;
      const targetMonkey =
        monkey[!(item % monkey.test) ? 'trueTarget' : 'falseTarget'];
      monkeyGroup[targetMonkey].items.push(item);
    }
  }
};

// We need to do a round many times
const cycleRounds = (
  monkeyGroup: ReturnType<typeof monkeys>,
  rounds: number,
  relief: number
) => {
  // We use a global modulo of all the divisors to prevent the numbers from growing larger than we can handle safely in floating point math
  const modulo = [...new Set(monkeyGroup.map(({ test }) => test))].reduce(
    (mod, next) => mod * next,
    1
  );
  while (rounds--) processRound(monkeyGroup, relief, modulo);
  return monkeyGroup;
};

// For the answers, we need to gather just the two monkeys that are most active
const getMostActiveMonkeys = (
  monkeyGroup: ReturnType<typeof monkeys>,
  count = 1
) => {
  const sorted = monkeyGroup.sort((a, b) => b.inpections - a.inpections);
  return sorted.slice(0, count);
};

// Part 1 is processing 20 rounds where our worry (value of an item) is divided by 3 before being tested.
console.log(
  'Part One:',
  getMostActiveMonkeys(cycleRounds(monkeys(), 20, 3), 2)
    .map((monkey) => monkey.inpections)
    .reduce(multiply)
);

// Part 2 is 10_000 rounds and out worry does not decrease at all
console.log(
  'Part Two:',
  getMostActiveMonkeys(cycleRounds(monkeys(), 10_000, 1), 2)
    .map((monkey) => monkey.inpections)
    .reduce(multiply)
);

function multiply(a: number, b: number) {
  return a * b;
}
