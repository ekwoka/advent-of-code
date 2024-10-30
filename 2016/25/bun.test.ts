import { partOne } from '.';
import { getInputRaw } from '../../utils';

const input = await getInputRaw(2016, 25);
describe('2016 Day 25', async () => {
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(175);
  }, 15_000);
});

/*
  describe('2016 Day 1 Rust', async () => {
    const { part_one, part_two } = await import('./main.rs');
    it.skip('Passes Part 1 Test', () => {
      expect(part_one('')).toBe(0);
    }, 15_000);
    it('Passes Part 1', () => {
      expect(part_one(input)).toBe(0);
    }, 15_000);
    it.skip('Passes Part 2 Test', () => {
      expect(part_two('')).toBe(0);
    }, 15_000);
    it('Passes Part 2', () => {
      expect(part_two(input)).toBe(0);
    }, 15_000);
  });
*/
