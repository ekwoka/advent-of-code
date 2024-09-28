import { createHash } from 'node:crypto';
import { range } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

const md5 = (content: string) =>
  createHash('md5').update(content).digest('hex');

export const partOne = (input: AOCInput): number => {
  const key = input.lines().nth(0);
  return (
    range(1, Number.POSITIVE_INFINITY)
      .map((i) => md5(`${key}${i}`))
      .findIndex((hash) => hash.startsWith('00000')) + 1
  );
};
export const partTwo = (input: AOCInput): number => {
  const key = input.lines().nth(0);
  return (
    range(1, Number.POSITIVE_INFINITY)
      .map((i) => md5(`${key}${i}`))
      .findIndex((hash) => hash.startsWith('000000')) + 1
  );
};
