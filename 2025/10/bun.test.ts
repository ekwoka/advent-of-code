import { getInputRaw } from '../../utils';

const input = await getInputRaw(2025, 10);

const sample = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;
describe('2025 Day 10 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(7);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(432);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(33n);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(0);
  }, 15_000);
});
