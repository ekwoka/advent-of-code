import { partOne } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2020 Day 15', async () => {
  const input = await getInput(2020, 15);
  it.skip('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput('0,3,6'))).toBe(436);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(249);
  });
  it.skip('Passes Part 2 Test', () => {
    expect(partOne(new AOCInput('0,3,6'), 30_000_000)).toBe(175_594);
  });
  it('Passes Part 2', () => {
    expect(partOne(input, 30_000_000)).toBe(41_687);
  });
});
