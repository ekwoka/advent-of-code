import { partOne, partTwo } from '.';
import { AOCInput, getInput, getInputRaw } from '../../utils';

describe('2016 Day 16', async () => {
  const input = await getInput(2016, 16);
  it('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput('10000'), 20)).toBe('01100');
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input, 272)).toBe('10010110010011110');
  }, 15_000);
  it.skip('Passes Part 2', () => {
    expect(partOne(input, 35_651_584)).toBe('01101011101100011');
  }, 15_000);
});

describe('2016 Day 16 Rust', async () => {
  const input = await getInputRaw(2016, 16);
  const { part_one } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one('10000', 20)).toBe('01100');
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input, 272)).toBe('10010110010011110');
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_one(input, 35_651_584)).toBe('01101011101100011');
  }, 15_000);
});
