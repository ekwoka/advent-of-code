import { getInputRaw } from '../../utils';

const input = await getInputRaw(2017, 12);
describe('2017 Day 12 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(
      part_one(`0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5`),
    ).toBe(6);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(130);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(189);
  }, 15_000);
});
