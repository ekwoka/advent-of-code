import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 8', async () => {
  const input = await getInput(2015, 8);
  it('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput(String.raw`"aaa\"aaa\\\x27"`))).toBe(7);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(1342);
  });
  it('Passes Part 2 Test', () => {
    expect(partTwo(new AOCInput(`"aaa\\"aaa"`))).toBe(6);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(2074);
  });
});
