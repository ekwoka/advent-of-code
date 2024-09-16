import { range } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

export const partOne = (input: AOCInput, time: number) => {
  return input
    .lines()
    .filter(Boolean)
    .map((line) => Array.from(line.matchAll(/\d+/g)).map(Number))
    .map(
      ([speed, activeTime, restTime]) =>
        speed * activeTime * ((time / (activeTime + restTime)) | 0) +
        Math.min(activeTime, time % (activeTime + restTime)) * speed,
    )
    .max();
};
export const partTwo = (input: AOCInput, time: number) => {
  const reindeer = input
    .lines()
    .filter(Boolean)
    .map((line) => Array.from(line.matchAll(/\d+/g)).map(Number))
    .map(([speed, activeTime, restTime]) =>
      range(0, time - 1)
        .scan((state, second) => {
          if (second % (activeTime + restTime) < activeTime) state[0] += speed;
          return state[0];
        }, 0)
        .peekable(),
    )
    .collect();
  const scores = reindeer.map(() => 0);
  while (reindeer.every((iter) => !iter.peek().done)) {
    const distances = reindeer.map((iter) => iter.nth(0));
    const max = Math.max(...distances);
    distances.forEach((distance, idx) => {
      if (distance === max) scores[idx]++;
    });
  }
  return Math.max(...scores);
};
