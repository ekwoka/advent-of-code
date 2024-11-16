import { getInputRaw } from '../../utils';

const input = await getInputRaw(2017, 11);
describe('2017 Day 11 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one('se,sw,se,sw,sw')).toBe(3);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(808);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(1_556);
  }, 15_000);
});
