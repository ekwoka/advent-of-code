import { partOne, partTwo } from '.';
import { getInput } from '../../utils';

describe('2015 Day 16', async () => {
  const input = await getInput(2015, 16);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(373);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(260);
  });
});
