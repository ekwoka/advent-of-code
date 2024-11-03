import { getInputRaw } from '../../utils';

const input = await getInputRaw(2017, 6);
describe('2017 Day 6 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one('0  2   7    0')).toBe(5);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(11_137);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two('0  2   7    0')).toBe(4);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(1_037);
  }, 15_000);
});
