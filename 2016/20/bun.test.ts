import { partOne, partTwo } from '.';
import { getInputRaw } from '../../utils';

const input = await getInputRaw(2016, 20);
describe('2016 Day 20', async () => {
  it('Passes Part 1 Test', () => {
    expect(
      partOne(`5-8
0-2
4-7`),
    ).toBe(3);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(19_449_262);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(
      partTwo(
        `5-8
0-2
4-7`,
        9,
      ),
    ).toBe(2);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(partTwo(input, 4_294_967_295)).toBe(119);
  }, 15_000);
});

/*
  describe('2016 Day 20 Rust', async () => {
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
