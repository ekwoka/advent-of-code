import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 5', async () => {
  const input = await getInput(2023, 5);
  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(new AOCInput(exampleInput))).toBe(35);
    });
    it('Passes Part 2 Test', () => {
      expect(partTwo(new AOCInput(exampleInput))).toBe(46);
    });
    it('Passes Part 1', () => {
      expect(partOne(input)).toBe(289863851);
    });
    it.skip('Passes Part 2', () => {
      expect(partTwo(input)).toBe(60568880);
    });
  });
  describe.skip('in Rust', () => {
    it('Passes Part 1 Test', () => {
      expect(part_one(toStr(exampleInput))).toBe(0);
    });
    it.skip('Passes Part 2 Test', () => {
      expect(part_two(toStr(exampleInput))).toBe(0);
    });
    it.skip('Passes Part 1', () => {
      expect(part_one(toStr(input.toString()))).toBe(0);
    });
    it.skip('Passes Part 2', () => {
      expect(part_two(toStr(input.toString()))).toBe(0);
    });
  });
});

const exampleInput =
  'seeds: 79 14 55 13\n\nseed-to-soil map:\n50 98 2\n52 50 48\n\nsoil-to-fertilizer map:\n0 15 37\n37 52 2\n39 0 15\n\nfertilizer-to-water map:\n49 53 8\n0 11 42\n42 0 7\n57 7 4\n\nwater-to-light map:\n88 18 7\n18 25 70\n\nlight-to-temperature map:\n45 77 23\n81 45 19\n68 64 13\n\ntemperature-to-humidity map:\n0 69 1\n1 0 69\n\nhumidity-to-location map:\n60 56 37\n56 93 4';
