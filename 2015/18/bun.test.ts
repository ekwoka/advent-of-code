import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 18', async () => {
  const input = await getInput(2015, 18);
  it('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(`.#.#.#
...##.
#....#
..#...
#.#..#
####..`),
        4,
      ),
    ).toBe(4);
  });
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(1061);
  });
  it('Passes Part 2 Test', () => {
    expect(
      partTwo(
        new AOCInput(`.#.#.#
...##.
#....#
..#...
#.#..#
####..`),
        5,
      ),
    ).toBe(17);
  });
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(1006);
  });
});
