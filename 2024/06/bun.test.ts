import { getInputRaw } from '../../utils';
const sample = `....#.....
.........#
..........
..#.......
.......#..
..........
.#..^.....
........#.
#.........
......#...`;
const input = await getInputRaw(2024, 6);
describe('2024 Day 6 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(41);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(4_665);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(6);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBeGreaterThan(1_512);
    expect(part_two(input)).toBeLessThan(1_744);
    expect(part_two(input)).not.toBe(1_644);
    expect(part_two(input)).not.toBe(1_513);
    expect(part_two(input)).toBe(1_688);
  }, 15_000);
});
