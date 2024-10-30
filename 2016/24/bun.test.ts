import { partOne } from '.';
import { getInputRaw } from '../../utils';

const input = await getInputRaw(2016, 24);
describe('2016 Day 24', async () => {
  it.skip('Passes Part 1 Test', () => {
    expect(
      partOne(`###########
#0.1.....2#
#.#######.#
#4.......3#
###########`),
    ).toBe(14);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(428);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(partOne(input, true)).toBe(680);
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
