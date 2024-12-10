import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 10);

const sample = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;
describe('2024 Day 10 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(36);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(646);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(81);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(1_494);
  }, 15_000);
});
