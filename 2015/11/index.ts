import { RustIterator } from '@ekwoka/rust-ts';
import { AOCInput } from '../../utils';

const chars = 'abcdefghijklmnopqrstuvwxyz'.split('');
const charIndex = Object.fromEntries(chars.map((char, index) => [char, index]));

const increment = (oldPass: string) =>
  new AOCInput(oldPass)
    .chars()
    .reverse()
    .scan((state, char) => {
      if (!state[0]) return char;
      const nextChar = chars[charIndex[char] + state[0]] ?? chars[0];
      state[0] = Number(nextChar === chars[0]);
      return nextChar;
    }, 1)
    .reverse()
    .collect()
    .join('');

const noRestrictedCharacter = (password: string) => !/i|l|o/.test(password);
const hasDoubleDouble = (password: string) =>
  /(.)\1.*?(?!\1)(.)\2/.test(password);
const hasSequence = (password: string) =>
  new RustIterator(chars)
    .window(3)
    .map((seq) => seq.join(''))
    .any((seq) => password.includes(seq));

export const partOne = (input: AOCInput): string => {
  let password = input.lines().nth(0).toString();
  do {
    password = increment(password);
  } while (
    !(
      noRestrictedCharacter(password) &&
      hasDoubleDouble(password) &&
      hasSequence(password)
    )
  );
  return password;
};
export const partTwo = (input: AOCInput): string => {
  return partOne(new AOCInput(partOne(input)));
};
