import { partOne } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 10', async () => {
  const input = await getInput(2015, 10);
  it.skip('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput('1'), 4)).toBe(6);
  });
  it('Passes Part 1', () => {
    expect(partOne(input, 40)).toBe(360154);
  });
  it('Passes Part 2', () => {
    expect(partOne(input, 50)).toBe(5103798);
  });
});
