import { getInputRaw } from '../../utils';

const input = await getInputRaw(2017, 5);

describe('2017 Day 5 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(
      part_one(`0
3
0
1
-3`),
    ).toBe(5);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(391_540);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(
      part_two(`0
3
0
1
-3`),
    ).toBe(10);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(30_513_679);
  }, 15_000);
});
