import { partOne, partTwo } from '.';
import { AOCInput, getInput, getInputRaw } from '../../utils';

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

describe('2016 Day 7 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  const input = await getInputRaw(2016, 7);
  it('Passes Part 1 Test', () => {
    expect(
      part_one(
        `abba[mnop]qrst
abcd[bddb]xyyx
aaaa[qwer]tyui
ioxxoj[asdfgh]zxcvbn`,
      ),
    ).toBe(2);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(110);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(242);
  }, 15_000);
});
