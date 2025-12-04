import { getInputRaw } from '../../utils';

const input = await getInputRaw(2025, 4);

const sample = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;
describe('2025 Day 4 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(13);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(1367);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(43);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(9144);
  }, 15_000);
});
