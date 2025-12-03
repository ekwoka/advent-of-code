import { getInputRaw } from '../../utils';

const input = await getInputRaw(2025, 3);

const sample = `987654321111111
811111111111119
234234234234278
818181911112111`;
describe('2025 Day 3 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(357);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(17142);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(3_121_910_778_619n);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(169_935_154_100_102n);
  }, 15_000);
});
