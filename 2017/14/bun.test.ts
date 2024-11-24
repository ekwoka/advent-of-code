import { getInputRaw } from '../../utils';

const input = await getInputRaw(2017, 14);
describe('2017 Day 14 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one('flqrgnkx')).toBe(8_108);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(8_250);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two('flqrgnkx')).toBe(1_242);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(1_113);
  }, 15_000);
});
