import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 12);

const sample = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;
describe('2024 Day 12 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(1_930);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(1_533_024);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(1206);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(910_066);
  }, 15_000);
});
