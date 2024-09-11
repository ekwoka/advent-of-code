import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 4', async () => {
  const input = await getInput(2015, 4);
  it('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput('pqrstuv'))).toBe(1048970);
    expect(partOne(new AOCInput('abcdef'))).toBe(609043);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(282749);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(0);
  });
});
