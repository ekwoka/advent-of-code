import { AOCInput, getInput } from '../../utils';
import { partOne, partTwo } from '.';

export const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 7', async () => {
  const input = await getInput(2023, 7);
  const example = new AOCInput(
    '32T3K 765\nT55J5 684\nKK677 28\nKTJJT 220\nQQQJA 483\n',
  );
  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(example)).toBe(6440);
    });
    it('Passes Part 2 Test', () => {
      expect(partTwo(example)).toBe(5905);
    });
    it('Passes Part 1', () => {
      const result = partOne(input);
      expect(result).toBe(252295678);
    });
    it('Passes Part 2', () => {
      const result = partTwo(input);
      expect(result).toBe(250577259);
    });
  });
});
