// https://adventofcode.com/2021/day/3

import input from './input.mjs';

function task1(input) {
  const output = input
    .reduce((acc, current) => {
      current.split('').forEach((c, i) => {
        if (!acc[i]) acc[i] = {};
        if (!acc[i][c]) acc[i][c] = 0;
        acc[i][c]++;
      });
      return acc;
    }, [])
    .map((space) => {
      return Object.entries(space).sort((a, b) => b[1] - a[1])[0][0];
    })
    .join('');
  const inverse = output
    .split('')
    .map((o) => (o === 1 ? 0 : 1))
    .join('');
  return Number.parseInt(output, 2) * Number.parseInt(inverse, 2);
}

function task2(input, up) {
  let i = 0;
  while (input.length > 1) {
    let value = input.reduce((acc, curr) => {
      return acc + Number.parseInt(curr.split('')[i]);
    }, 0);

    let bit;
    if (value === input.length / 2) bit = up ? 1 : 0;
    if (!bit && !up) value = input.length - value;

    bit = bit || value > input.length / 2 ? 1 : 0;
    input = input.filter((item) => item.split('')[i] === bit);
    i = (i + 1) % input[0].length;
  }

  return Number.parseInt(input[0], 2);
}

const answer = task1(input);

const answer2 = task2(input, true) * task2(input, false);

console.log(answer, answer2);
