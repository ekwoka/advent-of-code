// this one was a fucking nightmare. Snail Numbers are awful to work with and I ran into many issues with this. I chose to work with the snail numbers directly as a string, and not as a tree of nested arrays. This made it easy to find the next numbers and such, but it caused a lot of issues in accounting for 2 digit numbers.

import INPUT from './input.mjs';

function add(a, b) {
  return `[${a},${b}]`;
}

function explode(number, index, debug = false) {
  const pair = number
    .slice(index, index + 7)
    .replace(/[[\]]/g, '')
    .split(',')
    .map(Number);
  const offset =
    index + pair.slice(0, 2).reduce((acc, val) => (val > 9 ? acc + 1 : acc), 5);
  number = `${number.slice(0, index)}0${number.slice(offset)}`;
  number = explodeWalk(number, pair, index, debug);
  return number;
}

function explodeWalk(number, pair, index, debug = false) {
  index = Number.parseInt(index);
  let walkBack = index - 1;
  let walkForward = index + 2;
  while (walkBack) {
    const [char0, char1] = [number[walkBack - 1], number[walkBack]];
    if (!Number.isNaN(Number.parseInt(char1))) {
      const end = walkBack + 1;
      let start = walkBack;
      let value;
      if (!Number.isNaN(Number.parseInt(char0))) {
        value = Number.parseInt(char0 + char1);
        start--;
      } else {
        value = Number.parseInt(char1);
      }
      debug && console.log(value, start, end);
      number = number.slice(0, start) + (value + pair[0]) + number.slice(end);
      walkBack = false;
    } else {
      walkBack--;
    }
  }

  while (walkForward && walkForward < number.length) {
    const [char1, char2] = [number[walkForward], number[walkForward + 1]];
    if (!Number.isNaN(Number.parseInt(char1))) {
      const start = walkForward;
      let end = walkForward + 1;
      let value;
      if (!Number.isNaN(Number.parseInt(char2))) {
        value = Number.parseInt(char1 + char2);
        end++;
      } else {
        value = Number.parseInt(char1);
      }
      number = number.slice(0, start) + (value + pair[1]) + number.slice(end);
      walkForward = false;
    } else {
      walkForward++;
    }
  }

  return number;
}

function splitNumber(number, index) {
  const value = Number.parseInt(number[index] + number[index + 1]);
  const pair = [Math.floor(value / 2), Math.ceil(value / 2)];
  number = `${number.slice(0, index)}[${pair.join(',')}]${number.slice(index + 2)}`;
  return number;
}

function checkExplode(number) {
  let depth = 0;
  return number.split('').findIndex((char) => {
    if (char === '[') depth++;
    if (char === ']') depth--;
    return depth > 4;
  });
}

function checkSplit(number) {
  return number.split('').findIndex((char, i, number) => {
    if (
      Number.isNaN(Number.parseInt(char)) ||
      Number.isNaN(Number.parseInt(number[i + 1]))
    )
      return false;
    return Number.parseInt(char + number[i + 1]) > 9;
  });
}

function processNumbers(numbers, debug = false) {
  return numbers.reduce((output, next) => {
    let number = add(output, next);
    let [exIn, splIn] = [checkExplode(number), checkSplit(number)];
    while (exIn !== -1 || splIn !== -1) {
      debug && console.log(number);
      if (exIn !== -1) {
        debug && console.log('exploding at', number.slice(exIn, exIn + 5));
        number = explode(number, exIn, debug);
      } else {
        debug && console.log('splitting at', number.slice(splIn, splIn + 2));
        number = splitNumber(number, splIn, debug);
      }
      [exIn, splIn] = [checkExplode(number), checkSplit(number)];
    }
    debug && console.log(number);
    return number;
  });
}

function getMagnitude(number) {
  const string = number
    .replaceAll('[', '3*(')
    .replaceAll(']', ')*2')
    .replaceAll(',', ')+(');
  return new Function(`return ${string}`)();
}

function part1(input) {
  return getMagnitude(processNumbers(input));
}

function part2(input) {
  return input.reduce((max, first) => {
    const magnitude = input.reduce((max, second) => {
      const magnitude = getMagnitude(processNumbers([first, second]));
      return magnitude > max ? magnitude : max;
    }, 0);
    return magnitude > max ? magnitude : max;
  }, 0);
}

console.log('Part 1:', part1(INPUT));

console.log('Part 2:', part2(INPUT));
