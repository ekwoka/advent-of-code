import { createHash } from 'node:crypto';
import '@ekwoka/rust-ts/prelude';
import { range } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';
const md5 = (content: string) =>
  createHash('md5').update(content).digest('hex');
const threematch = /(\w)\1\1/;
const fivematch = /(\w)\1\1\1\1/;
export const partOne = (input: AOCInput) => {
  const salt = input.lines().nth(0)!.valueOf();
  return range(0, Number.POSITIVE_INFINITY)
    .map((i) => [i, md5(`${salt}${i}`)] as const)
    .scan(
      (state, [idx, hash]) => {
        const five = hash.match(fivematch);
        if (five) {
          const char = Number.parseInt(five[1], 16);
          const existing = state[0][char];
          state[0][char] = [idx];
          return existing.filter((i) => i + 1000 > idx);
        }
        const three = hash.match(threematch);
        if (three) state[0][Number.parseInt(three[1], 16)].push(idx);
        return [];
      },
      Array.from({ length: 16 }, () => [] as number[]),
    )
    .flat()
    .filter(Boolean)
    .take(64)
    .last();
};
const hashManyTimes = (content: string) => {
  let hash = content;
  for (let i = 0; i < 2017; i++) hash = md5(hash);
  return hash;
};
export const partTwo = (input: AOCInput) => {
  const salt = input.lines().nth(0)!.valueOf();
  return range(0, Number.POSITIVE_INFINITY)
    .map((i) => [i, hashManyTimes(`${salt}${i}`)] as const)
    .scan(
      (state, [idx, hash]) => {
        const five = hash.match(fivematch);
        if (five) {
          const char = Number.parseInt(five[1], 16);
          const existing = state[0][char];
          state[0][char] = [idx];
          return existing.filter((i) => i + 1000 > idx);
        }
        const three = hash.match(threematch);
        if (three) state[0][Number.parseInt(three[1], 16)].push(idx);
        return [];
      },
      Array.from({ length: 16 }, () => [] as number[]),
    )
    .flat()
    .filter(Boolean)
    .take(64)
    .last();
};
