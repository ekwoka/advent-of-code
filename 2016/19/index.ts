import { range } from '@ekwoka/rust-ts';
import '@ekwoka/rust-ts/prelude';

export const partOne = (input: string) => {
  const elves = Number(input);
  console.assert(!Number.isNaN(elves), 'Input is not a valid number');
  const presents = range(1, elves).collect();
  const getNext = (from: number, offset = 1) => {
    while (offset--)
      do {
        from = (from + 1) % presents.length;
      } while (!presents[from]);
    return from;
  };
  let toRemove = 1;
  let removed = 0;
  while (removed++ < elves - 1) {
    presents[toRemove] = 0;
    toRemove = getNext(toRemove, 2);
  }
  const last = presents.find((i) => i);
  return last;
};
export const partTwo = (input: string) => {
  const elves = Number(input);
  console.assert(!Number.isNaN(elves), 'Input is not a valid number');
  const presents = range(1, elves).collect();
  const getNext = (from: number, offset = 1) => {
    while (offset--)
      do {
        from = (from + 1) % presents.length;
      } while (!presents[from]);
    return from;
  };
  let toRemove = (presents.length / 2) | 0;
  let skip = presents.length % 2;
  let removed = 0;
  while (removed++ < elves - 1) {
    presents[toRemove] = 0;
    toRemove = getNext(toRemove, 1 + skip);
    skip ^= 1;
  }
  const last = presents.find((i) => i);
  return last;
};
