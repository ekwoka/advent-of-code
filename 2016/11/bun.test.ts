import { partOne, partTwo } from '.';
import { AOCInput, getInput, getInputRaw } from '../../utils';

describe('2016 Day 11', async () => {
  const input = await getInput(2016, 11);
  it.skip('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(`The first floor contains a hydrogen-compatible microchip and a lithium-compatible microchip.
The second floor contains a hydrogen generator.
The third floor contains a lithium generator.
The fourth floor contains nothing relevant.`),
      ),
    ).toBe(11);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(31);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(55);
  }, 15_000);
});

/*
  describe('2016 Day 11 Rust', async () => {
    const input = await getInputRaw(2016, 11);
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
