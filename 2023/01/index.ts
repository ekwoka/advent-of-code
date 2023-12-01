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
    .filter((line) => line.replaceAll(' ', '').length > 0)
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
