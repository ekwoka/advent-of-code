import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 6', async () => {
  const input = await getInput(2015, 6);
  it('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(
          'turn on 0,0 through 999,999\ntoggle 0,0 through 999,0\nturn off 499,499 through 500,500',
        ),
      ),
    ).toBe(998_996);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(543_903);
  });
  it('Passes Part 2 Test', () => {
    expect(
      partTwo(
        new AOCInput(
          'turn on 0,0 through 999,999\ntoggle 0,0 through 999,0\nturn off 499,499 through 500,500',
        ),
      ),
    ).toBe(1_001_996);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(14687245);
  });
});
