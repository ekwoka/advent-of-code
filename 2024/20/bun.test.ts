import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 20);

const sample = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`;
describe('2024 Day 20 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample, 12)).toBe(8);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input, 100)).toBe(1_332);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample, 70)).toBe(41);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input, 100)).toBe(987_695);
  }, 15_000);
});
