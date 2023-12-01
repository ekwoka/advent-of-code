import { AOCInput } from '../../utils';

const makeDigitRegex = (digit: string) => {
  const has_number_after = `(?:.\\D*${digit})`;
  return new RegExp(
    `(${digit})(?:(?:(?=${has_number_after})(?:.)|(${digit})))*\\D*$`,
  );
};

const partOneRegex = makeDigitRegex('\\d');
export const partOne = (input: AOCInput): number => {
  return input
    .lines()
    .filter((line) => Boolean(line.length))
    .map((line) => line.match(partOneRegex))
    .map(([_, first, second = first]) => Number(`${first}${second}`))
    .reduce((total, next) => total + next, 0);
};

const wordDigitMap = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const wordToDigit = (word: string): number => {
  return wordDigitMap[word] ?? Number(word);
};

const partTwoRegex = makeDigitRegex(
  `(?:\\d|${Object.keys(wordDigitMap).join('|')})`,
);

export const partTwo = (input: AOCInput): number => {
  return input
    .lines()
    .filter((line) => Boolean(line.length))
    .map((line) => line.match(partTwoRegex))
    .map(([_, first, second = first]) =>
      Number(
        `${wordToDigit(first)}${wordDigitMap[second] ?? wordToDigit(second)}`,
      ),
    )
    .reduce((total, next) => total + next, 0);
};

/*
 * These accomplish the task purely on the character stream, piece by piece with as little memory overhead as possible to keep track of what is happening.
 */

export const partOneStream = (input: AOCInput): number => {
  let left = 0;
  let right = 0;
  let total = 0;
  input
    .chars()
    .filter((char) => Boolean(Number(char)) || char === '\n')
    .forEach((char) => {
      if (char === '\n') {
        total += left + right;
        left = 0;
        right = 0;
        return;
      }
      left ||= Number(char) * 10;
      right = Number(char);
    });
  return total + left + right;
};

interface Tree {
  [key: string]: number | Tree | null;
}

const characterTree: Tree = {};

Array.from({ length: 10 }, (_, i) => i).forEach((i) => (wordDigitMap[i] = i));
Object.entries(wordDigitMap).forEach(([word, digit]) => {
  let current = characterTree;
  const chars = word.split('');
  const final = chars.pop()!;
  while (chars.length) {
    const char = chars.shift()!;
    current = (current[char] ||= {}) as Tree;
  }
  current[final] = digit;
});

const safeChars = new Set(Object.keys(wordDigitMap).join('').split(''));

export const partTwoStream = (input: AOCInput): number => {
  let left = 0;
  let right = 0;
  let total = 0;
  const trackers = [];
  input.chars().forEach((char) => {
    if (!safeChars.has(char)) trackers.length = 0;
    trackers.forEach((tracker, i) => {
      trackers[i] = tracker?.[char] ?? null;
    });
    while (
      trackers.length &&
      (trackers[0] === null || trackers[0] === undefined)
    )
      trackers.shift();
    if (char in characterTree) trackers.push(characterTree[char]);
    if (char === '\n') {
      total += left + right;
      left = 0;
      right = 0;
      return;
    }
    if (typeof trackers[0] !== 'number') return;
    const num = trackers.shift()!;
    left ||= num * 10;
    right = num;
  });
  return total + left + right;
};
