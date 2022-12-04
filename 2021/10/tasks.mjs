// Syntax Checker

// import input from './input.mjs';

const input = [
  '[({(<(())[]>[[{[]{<()<>>',
  '[(()[<>])]({[<{<<[]>>(',
  '{([(<{}[<>[]}>{[]{[(<()>',
  '(((({<>}<{<{<>}{[]{[]{}',
  '[[<[([]))<([[{}[[()]]]',
  '[{[{({}]{}}([{[{{{}}([]',
  '{<[[]]>}<{[{[{[]{()[[[]',
  '[<(<(<(<{}))><([]([]()',
  '<{([([[(<>()){}]>(<<{{',
  '<{([{{}}[<[[[<>{}]]]>[]]',
];

const OPEN = /[<|[|(|{]/;

const CHAR_MAP = {
  '<': '>',
  '[': ']',
  '(': ')',
  '{': '}',
};
const POINT_MAP_ONE = {
  '>': 25137,
  ']': 57,
  ')': 3,
  '}': 1197,
};

const POINT_MAP_TWO = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

function task1(input) {
  let breaks = input.reduce((breaks, line) => {
    let char = checkChars(line)[0];
    return char ? [...breaks, char] : breaks;
  }, []);
  return breaks.reduce((sum, char) => sum + POINT_MAP_ONE[char], 0);
}

function task2(input) {
  let stacks = input.reduce((stacks, line) => {
    let check = checkChars(line);
    return check[0] ? stacks : [...stacks, check[1]];
  }, []);

  return stacks
    .map((stack) => stack.map((char) => CHAR_MAP[char]).reverse())
    .map((stack) =>
      stack.reduce((sum, char) => sum * 5 + POINT_MAP_TWO[char], 0)
    )
    .sort((a, b) => a - b)[Math.floor(stacks.length / 2)];
}

function checkChars(line) {
  let illegal,
    stack = [],
    chars = line.split('');
  while (!illegal && chars.length) {
    let char = chars.shift();
    if (OPEN.test(char)) {
      stack.push(char);
    } else {
      if (CHAR_MAP[stack.at(-1)] !== char) {
        illegal = char;
      } else {
        stack.pop();
      }
    }
  }
  return [illegal, stack];
}

console.log(task1(input));

console.log(task2(input));
