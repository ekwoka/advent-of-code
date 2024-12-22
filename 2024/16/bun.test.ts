import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 16);

const sample = `#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`;
describe('2024 Day 16 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(11_048);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(102_488);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(64);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(559);
  }, 15_000);
});
