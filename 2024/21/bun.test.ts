import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 21);

const sample = `029A
980A
179A
456A
379A`;
describe('2024 Day 21 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample)).toBe(126_384);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(0);
  }, 15_000);
  it.skip('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(0);
  }, 15_000);
  it.skip('Passes Part 2', () => {
    expect(part_two(input)).toBe(0);
  }, 15_000);
});
