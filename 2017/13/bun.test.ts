import { getInputRaw } from '../../utils';

const input = await getInputRaw(2017, 13);
describe('2017 Day 13 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(
      part_one(`0: 3
1: 2
4: 4
6: 4`),
    ).toBe(24);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(2_688);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(
      part_two(`0: 3
1: 2
4: 4
6: 4`),
    ).toBe(10);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(3_876_272);
  }, 15_000);
});
