import { partOne, partTwo } from '.';
import { AOCInput, getInput, getInputRaw } from '../../utils';

describe('2016 Day 12', async () => {
  const input = await getInput(2016, 12);
  it('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(`cpy 41 a
inc a
inc a
dec a
jnz a 2
dec a`),
      ),
    ).toBe(42);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(318_083);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(9_227_737);
  }, 15_000);
});

/*
  describe('2016 Day 12 Rust', async () => {
    const input = await getInputRaw(2016, 12);
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
