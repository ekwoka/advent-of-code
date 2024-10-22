import { partOne, partTwo } from '.';
import { AOCInput, getInput, getInputRaw } from '../../utils';

describe('2016 Day 14', async () => {
  const input = await getInput(2016, 14);
  it('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput('abc'))).toBe(22_728);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(23_890);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(partTwo(new AOCInput('abc'))).toBe(22_551);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(22_696);
  }, 15_000);
});

/*
  describe('2016 Day 1 Rust', async () => {
    const input = await getInputRaw(2016, 14);
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
