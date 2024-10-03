import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 4', async () => {
  const input = await getInput(2015, 4);
  it.skip('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput('pqrstuv'))).toBe(1_048_970);
    expect(partOne(new AOCInput('abcdef'))).toBe(609_043);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(282_749);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(9_962_624);
  });
});
