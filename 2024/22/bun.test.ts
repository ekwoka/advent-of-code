import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 22);

const sample = `1
10
100
2024`;
const sample_2 = `1
2
3
2024`;
describe('2024 Day 22 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(37_327_623n);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(13_429_191_512n);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample_2)).toBe(23);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(1_582);
  }, 15_000);
});
