// https://adventofcode.com/2021/day/2

import input from './input.mjs';

// Task 1 Lost

// Task 2:

const commands = input.map((i) => {
  const [command, value] = i.split(' ');
  return { command, value: Number.parseInt(value) };
});

function task2(commands) {
  return commands.reduce(
    ({ horizontal, depth, aim }, { command, value }) => {
      if (command === 'forward')
        return {
          horizontal: horizontal + value,
          depth: depth + aim * value,
          aim,
        };
      if (command === 'up')
        return {
          horizontal,
          depth,
          aim: aim - value,
        };
      if (command === 'down')
        return {
          horizontal,
          depth,
          aim: aim + value,
        };
      console.log('input error');
    },
    {
      horizontal: 0,
      depth: 0,
      aim: 0,
    },
  );
}

console.log(task2(commands));
