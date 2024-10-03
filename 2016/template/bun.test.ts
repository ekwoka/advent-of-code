import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2016 Day 1', async () => {
  const input = await getInput(2016, 1);
  it('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput(''))).toBe(0);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(0);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(partTwo(new AOCInput(''))).toBe(0);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(0);
  }, 15_000);
});
