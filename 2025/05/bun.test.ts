import { getInputRaw } from '../../utils';

const input = await getInputRaw(2025, 5);

const sample = `3-5
10-14
16-20
12-18

1
5
8
11
17
32`;
describe('2025 Day 5 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(3);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(712);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(14n);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(332_998_283_036_769n);
  }, 15_000);
});
