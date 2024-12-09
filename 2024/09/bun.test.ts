import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 9);

const sample = `2333133121414131402`;
describe('2024 Day 9 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(1_928n);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(6_399_153_661_894n);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(2_858n);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(6_421_724_645_083n);
  }, 15_000);
});
