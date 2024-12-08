import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 8);

const sample = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;
describe('2024 Day 8 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(14);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(303);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(34);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(1_045);
  }, 15_000);
});
