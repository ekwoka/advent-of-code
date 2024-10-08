import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 20', async () => {
  const input = await getInput(2015, 20);
  it.skip('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput('100'))).toBe(6);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(665_280);
  });
  it.skip('Passes Part 2 Test', () => {
    expect(partTwo(new AOCInput('100'))).toBe(6);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(705_600);
  });
});
