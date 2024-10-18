import { range } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';
import { Vec2 } from '../../utils/vec';

enum Instruction {
  Off = 0,
  On = 1,
  Toggle = 2,
}

export const partOne = (input: AOCInput): number => {
  return input
    .lines()
    .map((line) => {
      const [instruction, start, end] = line
        .match(/(turn on|turn off|toggle) (\d+,\d+) through (\d+,\d+)/)!
        .slice(1);
      return [
        instruction === 'turn off'
          ? Instruction.Off
          : instruction === 'turn on'
            ? Instruction.On
            : Instruction.Toggle,
        Vec2.from(start),
        Vec2.from(end),
      ] as const;
    })
    .fold((acc: number[], [instruction, start, end]) => {
      range(start.y, end.y)
        .flatMap((y) => range(start.x, end.x).map((x) => new Vec2(x, y)))
        .map(Vec2.dotApply(new Vec2(1, 1000)))
        .forEach((index) => {
          switch (instruction) {
            case Instruction.On:
              acc[index] = 1;
              break;
            case Instruction.Off:
              acc[index] = 0;
              break;
            case Instruction.Toggle:
              acc[index] ^= 1;
              break;
          }
        });
      return acc;
    }, new Array(1_000_000).fill(0))
    .filter(Number).length;
};

export const partTwo = (input: AOCInput): number => {
  return input
    .lines()
    .map((line) => {
      const [instruction, start, end] = line
        .match(/(turn on|turn off|toggle) (\d+,\d+) through (\d+,\d+)/)!
        .slice(1);
      return [
        instruction === 'turn off'
          ? Instruction.Off
          : instruction === 'turn on'
            ? Instruction.On
            : Instruction.Toggle,
        Vec2.from(start),
        Vec2.from(end),
      ] as const;
    })
    .fold((acc: number[], [instruction, start, end]) => {
      range(start.y, end.y)
        .flatMap((y) => range(start.x, end.x).map((x) => new Vec2(x, y)))
        .map(Vec2.dotApply(new Vec2(1, 1000)))
        .forEach((index) => {
          switch (instruction) {
            case Instruction.On:
              acc[index] += 1;
              break;
            case Instruction.Off:
              acc[index] = Math.max(0, acc[index] - 1);
              break;
            case Instruction.Toggle:
              acc[index] += 2;
              break;
          }
        });
      return acc;
    }, new Array(1_000_000).fill(0))
    .reduce((a, b) => a + b);
};
