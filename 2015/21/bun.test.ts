import { partOne, partTwo } from '.';
import { getInput } from '../../utils';

describe('2015 Day 21', async () => {
  const input = await getInput(2015, 21);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(91);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(0);
  });
});
