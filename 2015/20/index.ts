import { range } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

export const partOne = (input: AOCInput) => {
  const target = input.lines().filter(Boolean).map(Number).nth(0)! / 10;
  const buffer = new Uint32Array(target | 0);
  let limit = target;
  for (const elf of range(1, target, 1))
    for (const house of range(elf, limit, elf))
      if ((buffer[house] += elf) >= target) limit = house;
  for (const [house, presents] of buffer.entries())
    if (presents >= target) return house;
  return -1;
};
export const partTwo = (input: AOCInput) => {
  const target = input.lines().filter(Boolean).map(Number).nth(0)! / 11;
  const buffer = new Uint32Array(target | 0);
  let limit = target;
  for (const elf of range(1, target, 1))
    for (const house of range(elf, limit, elf).take(50))
      if ((buffer[house] += elf) >= target) limit = house;
  for (const [house, presents] of buffer.entries())
    if (presents >= target) return house;
  return -1;
};
