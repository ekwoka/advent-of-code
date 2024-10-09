import { partOne, partTwo } from '.';
import { AOCInput, getInput, getInputRaw } from '../../utils';

describe('2016 Day 10', async () => {
  const input = await getInput(2016, 10);
  it('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(
          `value 5 goes to bot 2
bot 2 gives low to bot 1 and high to bot 0
value 3 goes to bot 1
bot 1 gives low to output 1 and high to bot 0
bot 0 gives low to output 2 and high to output 0
value 2 goes to bot 2`,
        ),
        2,
        5,
      ),
    ).toBe(2);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input, 17, 61)).toBe(101);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(
      partTwo(
        new AOCInput(`value 5 goes to bot 2
bot 2 gives low to bot 1 and high to bot 0
value 3 goes to bot 1
bot 1 gives low to output 1 and high to bot 0
bot 0 gives low to output 2 and high to output 0
value 2 goes to bot 2`),
      ),
    ).toBe(30);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(37_789);
  }, 15_000);
});

/*
describe('2016 Day 10 Rust', async () => {
  const input = await getInputRaw(2016, 10);
  const { part_one, part_two } = await import('./main.rs');
  it.skip('Passes Part 1 Test', () => {
    expect(part_one('')).toBe(2);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(0);
  }, 15_000);
  it.skip('Passes Part 2 Test', () => {
    expect(part_two('')).toBe(0);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(0);
  }, 15_000);
});
 */
