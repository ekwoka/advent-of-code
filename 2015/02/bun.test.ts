import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 2', async () => {
  const input = await getInput(2015, 2);
  it('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput('2x3x4\n1x1x10'))).toBe(101);
  });
  it('Passes Part 2 Test', () => {
    expect(partTwo(new AOCInput('2x3x4\n1x1x10'))).toBe(48);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(1588178);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(3783758);
  });
});
