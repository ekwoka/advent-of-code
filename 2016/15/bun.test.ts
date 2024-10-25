import { partOne, partTwo } from '.';
import { AOCInput, getInput, getInputRaw } from '../../utils';

describe('2016 Day 15', async () => {
  const input = await getInput(2016, 15);
  it.skip('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(`Disc #1 has 5 positions; at time=0, it is at position 4.
Disc #2 has 2 positions; at time=0, it is at position 1.`),
      ),
    ).toBe(5);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(122_318);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(3_208_583);
  }, 15_000);
});

describe('2016 Day 15 Rust', async () => {
  const input = await getInputRaw(2016, 15);
  const { part_one, part_two } = await import('./main.rs');
  it.skip('Passes Part 1 Test', () => {
    expect(
      part_one(`Disc #1 has 5 positions; at time=0, it is at position 4.
Disc #2 has 2 positions; at time=0, it is at position 1.`),
    ).toBe(5);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(122_318);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(3_208_583);
  }, 15_000);
});
