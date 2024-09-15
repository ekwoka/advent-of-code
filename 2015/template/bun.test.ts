import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 1', async () => {
  const input = await getInput(2015, 1);
  it('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput(`1`))).toBe(6);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(0);
  });
  it('Passes Part 1 Test', () => {
    expect(partTwo(new AOCInput(`1`))).toBe(0);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(0);
  });
});