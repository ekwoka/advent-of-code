import { range } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

export const partOne = (input: AOCInput) => {
  const target = input.lines().filter(Boolean).map(Number).nth(0) / 10;
  const buffer = new Uint32Array(target | 0);
  for (const elf of range(1, target, 1))
    for (const house of range(elf, target, elf)) buffer[house] += elf;
  for (const [house, presents] of buffer.entries())
    if (presents >= target) return house;
  return -1;
};
export const partTwo = (input: AOCInput) => {
  const target = input.lines().filter(Boolean).map(Number).nth(0);
  const buffer = new Uint32Array((target / 2) | 0);
  for (const elf of range(1, (target / 2) | 0, 1))
    for (const house of range(elf, (target / 10) | 0, elf).take(50))
      buffer[house] += elf * 11;
  for (const [house, presents] of buffer.entries())
    if (presents >= target) return house;
  return -1;
};
