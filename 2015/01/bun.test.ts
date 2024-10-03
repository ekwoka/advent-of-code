import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 1', async () => {
  const input = await getInput(2015, 1);
  it.skip('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput(')())())'))).toBe(-3);
  });
  it.skip('Passes Part 2 Test', () => {
    expect(partTwo(new AOCInput('()())'))).toBe(5);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(232);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(1783);
  });
});
