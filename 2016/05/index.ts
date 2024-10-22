import '@ekwoka/rust-ts/prelude';
import { createHash, hash } from 'node:crypto';
import { range } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

const md5 = (content: string) => createHash('md5').update(content).digest();
export const partOne = (input: AOCInput) => {
  console.log('\n');
  const key = input.lines().nth(0)!.valueOf();
  return range(0, Number.POSITIVE_INFINITY)
    .map((i) => md5(`${key}${i}`))
    .map((hash) => new Uint32Array(hash.buffer, 0, 1)[0])
    .filter(not(masksTo(THREE_HEX_MASK)))
    .map(bitwiseMask(FOURTH_HEX_MASK))
    .map(rShift(16))
    .map(toHex(0))
    .scan((state, char) => {
      state[0] += char;
      process.stdout.cursorTo(0);
      process.stdout.moveCursor(0, -1);
      process.stdout.clearLine(0);
      process.stdout.write(`password: ${state[0].padEnd(8, '_')}\n`);
      return char;
    }, '')
    .take(8)
    .sum();
};
export const partTwo = (input: AOCInput) => {
  const key = input.lines().nth(0)!.valueOf();
  console.log('\n');
  return (
    range(0, Number.POSITIVE_INFINITY)
      .map((i) => md5(`${key}${i}`))
      /* .inspect((hash) => {
      current = hash[Symbol.iterator]().iter().map(toHex(2)).sum();
      log();
    }) */
      .map((hash) => new Uint32Array(hash.buffer, 0, 1)[0])
      .filter(not(masksTo(POSITION_LESS_THAN_EIGHT)))
      .map(rShift(16))
      .map(bitwiseMask(POSITION_AND_VALUE))
      .map(toHex(4))
      .map((hash) => [Number(hash[3]), hash[0]] as const)
      .scan((state, charData) => {
        if (state[0][charData[0]] !== '_')
          return null as unknown as [number, string];
        state[0][charData[0]] = charData[1];
        process.stdout.cursorTo(0);
        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine(0);
        process.stdout.write(`password: ${state[0].join('')}\n`);
        /* password = state[0]; */
        return charData;
      }, Array(8).fill('_'))
      .filter(Boolean)
      .take(8)
      .sort(([a], [b]) => a - b)
      .map(([, char]) => char)
      .sum()
  );
};
export const partTwoOptimized = (input: AOCInput) => {
  console.log('\n');
  const key = input.lines().nth(0)!.valueOf();
  return range(0, Number.POSITIVE_INFINITY)
    .map((i) => md5(`${key}${i}`))
    .filter((hash) => hash[0] === 0 && hash[1] === 0 && hash[2] < 8)
    .map((hash) => [hash[2], toHex(2)(hash[3])[0]] as const)
    .scan((state, charData) => {
      if (state[0][charData[0]] !== '_')
        return null as unknown as [number, string];
      state[0][charData[0]] = charData[1];
      process.stdout.cursorTo(0);
      process.stdout.moveCursor(0, -1);
      process.stdout.clearLine(0);
      process.stdout.write(`password: ${state[0].join('')}\n`);
      return charData;
    }, Array(8).fill('_'))
    .filter(Boolean)
    .take(8)
    .sort(([a], [b]) => a - b)
    .map(([, char]) => char)
    .sum();
};

export const partTwoNaive = (input: AOCInput) => {
  console.log('\n');
  const key = input.lines().nth(0)!.valueOf();
  return range(0, Number.POSITIVE_INFINITY)
    .map((i) => md5(`${key}${i}`))
    .map((hash) =>
      hash[Symbol.iterator]().iter().map(toHex(2)).sum().padStart(32, '0'),
    )
    .filter((hash) => hash.startsWith('00000'))
    .filter((hash) => Number(hash[5]) < 8)
    .map((hash) => [Number(hash[5]), hash[6]] as const)
    .scan((state, charData) => {
      if (state[0][charData[0]] !== '_')
        return null as unknown as [number, string];
      state[0][charData[0]] = charData[1];
      process.stdout.cursorTo(0);
      process.stdout.moveCursor(0, -1);
      process.stdout.clearLine(0);
      process.stdout.write(`password: ${state[0].join('')}\n`);
      return charData;
    }, Array(8).fill('_'))
    .filter(Boolean)
    .take(8)
    .sort(([a], [b]) => a - b)
    .map(([, char]) => char)
    .sum();
};

const THREE_HEX_MASK = 0b1111_0000_1111_1111_1111_1111;
const FOURTH_HEX_MASK = 0b1111_0000_0000_0000_0000;
const POSITION_LESS_THAN_EIGHT = 0b1111_1000_1111_1111_1111_1111;
const POSITION_AND_VALUE = 0b1111_0000_0000_0111;

const bitwiseMask = (mask: number) => (value: number) => value & mask;
const masksTo = (mask: number) => (value: number) => Boolean(value & mask);
const not = (predicate: (value: number) => boolean) => (value: number) =>
  !predicate(value);
const rShift = (distance: number) => (value: number) => value >> distance;
const toHex =
  (padding = 0) =>
  (value: number) =>
    value.toString(16).padStart(padding, '0');
