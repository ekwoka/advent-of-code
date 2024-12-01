import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 1);
describe('2024 Day 1 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(
      part_one(`3   4
4   3
2   5
1   3
3   9
3   3`),
    ).toBe(11);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(1_388_114);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(
      part_two(`3   4
4   3
2   5
1   3
3   9
3   3`),
    ).toBe(31);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(23_529_853);
  }, 15_000);
});
