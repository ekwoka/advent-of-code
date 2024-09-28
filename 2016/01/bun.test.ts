import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2016 Day 1', async () => {
  const input = await getInput(2016, 1);
  it('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput('R5, L5, R5, R3'))).toBe(12);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(230);
  });
  it('Passes Part 2 Test', () => {
    expect(partTwo(new AOCInput('R8, R4, R4, R8'))).toBe(4);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(154);
  });
});
