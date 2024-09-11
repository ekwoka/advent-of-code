import type { AOCInput } from '../../utils';

export const partOne = (input: AOCInput): number => {
  return input
    .lines()
    .filter(Boolean)
    .filter(hasNoBadStrings)
    .filter(has3Vowels)
    .filter(hasDoubleLetter)
    .count();
};
const has3Vowels = (str: AOCInput) => (str.match(/[aeiou]/g)?.length ?? 0) >= 3;

const hasDoubleLetter = (str: AOCInput) => str.match(/(.)\1/) !== null;

const hasNoBadStrings = (str: AOCInput) => str.match(/ab|cd|pq|xy/) === null;

export const partTwo = (input: AOCInput): number => {
  return input
    .lines()
    .filter(Boolean)
    .filter(hasPairTwice)
    .filter(hasRepeatingLetter)
    .count();
};

const hasPairTwice = (str: AOCInput) => str.match(/(..).*\1/) !== null;

const hasRepeatingLetter = (str: AOCInput) => str.match(/(.).\1/) !== null;
