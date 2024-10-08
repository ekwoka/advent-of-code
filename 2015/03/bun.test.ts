import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 3', async () => {
  const input = await getInput(2015, 3);
  it.skip('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput('^>v<'))).toBe(4);
  });
  it.skip('Passes Part 2 Test', () => {
    expect(partTwo(new AOCInput('^>v<'))).toBe(3);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(2592);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(2360);
  });
});
