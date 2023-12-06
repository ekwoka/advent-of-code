import { AOCInput } from '../../utils';
/**
 * --- Day 6: Wait For It ---
 */

export const partOne = (input: AOCInput): number => {
  return input
    .lines()
    .map((line) =>
      line
        .splitBy(' ')
        .filter((part) => Boolean(part.length))
        .map(Number)
        .filter(Boolean),
    )
    .window(2)
    .map(([a, b]) => a.zip(b))
    .nth(0)
    .map(([time, distance]) => {
      let minHoldTime = 0;
      while (minHoldTime * (time - minHoldTime) <= distance) minHoldTime += 5;
      while (minHoldTime * (time - minHoldTime) > distance) minHoldTime--;
      let maxHoldTime = time;
      while (maxHoldTime * (time - maxHoldTime) <= distance) maxHoldTime -= 5;
      while (maxHoldTime * (time - maxHoldTime) > distance) maxHoldTime++;
      return [minHoldTime, maxHoldTime - 1];
    })
    .map(([min, max]) => max - min)
    .reduce((a, b) => a * b, 1);
};

export const partTwo = (input: AOCInput): bigint => {
  return input
    .lines()
    .filter((line) => line.length > 0)
    .map((line) =>
      line
        .splitBy(' ')
        .filter((part) => Boolean(part.length))
        .map(Number)
        .filter(Boolean)
        .map((num) => `${num}`)
        .sum(),
    )
    .map(Number)
    .map(BigInt)
    .window(2)
    .map(([time, distance]) => {
      let minHoldTime = 0n;
      while (minHoldTime * (time - minHoldTime) <= distance)
        minHoldTime += 100n;
      while (minHoldTime * (time - minHoldTime) > distance) minHoldTime--;
      let maxHoldTime = time;
      while (maxHoldTime * (time - maxHoldTime) <= distance)
        maxHoldTime -= 100n;
      while (maxHoldTime * (time - maxHoldTime) > distance) maxHoldTime++;
      return [minHoldTime, maxHoldTime - 1n];
    })
    .flat()
    .reduce((min, max) => max - min);
};
