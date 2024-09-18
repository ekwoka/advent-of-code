import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 19', async () => {
  const input = await getInput(2015, 19);
  it('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(`H => HO
H => OH
O => HH

HOHOHO`),
      ),
    ).toBe(7);
    expect(
      partOne(
        new AOCInput(`H => HO
H => OH
HO => HH

HOHOHO`),
      ),
    ).toBe(7);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(509);
  });
  it('Passes Part 2 Test', () => {
    expect(
      partTwo(
        new AOCInput(`e => H
e => O
H => HO
H => OH
O => HH

HOHOHO`),
      ),
    ).toBe(6);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(195);
  });
});
