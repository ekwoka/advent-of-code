import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 25);

const sample = `#####
.####
.####
.####
.#.#.
.#...
.....

#####
##.##
.#.##
...##
...#.
...#.
.....

.....
#....
#....
#...#
#.#.#
#.###
#####

.....
.....
#.#..
###..
###.#
###.#
#####

.....
.....
.....
#....
#.#..
#.#.#
#####`;
describe('2024 Day 25 Rust', async () => {
  const { part_one } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(3);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(3_242);
  }, 15_000);
});
