import { getInputRaw } from '../../utils';

const input = await getInputRaw(2025, 2);

const sample = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,1698522-1698528,446443-446449,38593856-38593862,565653-565659,824824821-824824827,2121212118-2121212124`;
describe('2025 Day 2 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(1_227_775_554n);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(23_560_874_270n);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(4_174_379_265n);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(44_143_124_633n);
  }, 15_000);
});
