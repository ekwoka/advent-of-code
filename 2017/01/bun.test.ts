import { getInputRaw } from '../../utils';

const input = await getInputRaw(2017, 1);

describe('2017 Day 1 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one('1122')).toBe(3);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(1_047);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two('123425')).toBe(4);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(982);
  }, 15_000);
});
