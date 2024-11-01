import { getInputRaw } from '../../utils';

const input = await getInputRaw(2017, 2);

describe('2017 Day 2 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(
      part_one(`5 1 9 5
7 5 3
2 4 6 8`),
    ).toBe(18);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(47_623);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(
      part_two(`5 9 2 8
9 4 7 3
3 8 6 5`),
    ).toBe(9);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(312);
  }, 15_000);
});
