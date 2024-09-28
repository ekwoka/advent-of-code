// https://adventofcode.com/2021/day/1

import input from './input.mjs';

//Task 1:

function countDepth(samples) {
  return samples.reduce(
    ([count, prev], current) => {
      if (current > prev) return [count + 1, current];
      return [count, current];
    },
    [-1, 0],
  )[0];
}

// Task 2:

function countRollingDepth(samples) {
  return samples.reduce(
    ([count, previous, rolling], current) => {
      if (rolling.length < 2) return [count, previous, [...rolling, current]];
      rolling.push(current);
      const newSum = rolling.reduce((a, b) => a + b);
      if (newSum > previous) return [count + 1, newSum, rolling.slice(1)];
      return [count, newSum, rolling.slice(1)];
    },
    [-1, 0, []],
  )[0];
}

console.log(countDepth(input), countRollingDepth(input));
