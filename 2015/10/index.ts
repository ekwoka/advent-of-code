import type { AOCInput } from '../../utils';

const runLengthEncode = (input: string) =>
  input.replaceAll(/((\d)\2*)/g, (match) => `${match.length}${match[0]}`);

export const partOne = (input: AOCInput, repetition = 40): number => {
  let speak = input.lines().filter(Boolean).nth();
  while (repetition--) speak = runLengthEncode(speak);
  return speak.length;
};
