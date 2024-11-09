import { getInputRaw } from '../../utils';

const input = await getInputRaw(2017, 3);

describe('2017 Day 3 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one('1')).toBe(0);
    expect(part_one('12')).toBe(3);
    expect(part_one('23')).toBe(2);
    expect(part_one('1024')).toBe(31);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(430);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two('55')).toBe(57);
    expect(part_two('760')).toBe(806);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(312_453);
  }, 15_000);
});
