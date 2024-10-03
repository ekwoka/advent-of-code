import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2016 Day 2', async () => {
  const input = await getInput(2016, 2);
  it.skip('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(`ULL
RRDDD
LURDL
UUUUD`),
      ),
    ).toBe('1985');
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe('19636');
  });
  it.skip('Passes Part 2 Test', () => {
    expect(
      partTwo(
        new AOCInput(`ULL
RRDDD
LURDL
UUUUD`),
      ),
    ).toBe('5DB3');
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe('3CC43');
  });
});
