import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2016 Day 7', async () => {
  const input = await getInput(2016, 7);
  it('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(`abba[mnop]qrst
abcd[bddb]xyyx
aaaa[qwer]tyui
ioxxoj[asdfgh]zxcvbn`),
      ),
    ).toBe(2);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(110);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(242);
  }, 15_000);
});
