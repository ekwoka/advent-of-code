import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2016 Day 3', async () => {
  const input = await getInput(2016, 3);
  it.skip('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput('5 10 25\n5 5 5'))).toBe(1);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(862);
  });
  it.skip('Passes Part 2 Test', () => {
    expect(partTwo(new AOCInput('5 10 25\n5 5 5\n25 10 5'))).toBe(1);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(1_577);
  });
});
