import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 11', async () => {
  const input = await getInput(2015, 11);
  it('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput('abcdefgh\n'))).toBe('abcdffaa');
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe('hepxxyzz');
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe('heqaabcc');
  });
});
