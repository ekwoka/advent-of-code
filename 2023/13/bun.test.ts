import { AOCInput, getInput } from '../../utils';
import { partOne, partTwo } from '.';

export const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 12', async () => {
  const input = await getInput(2023, 13);
  const example1 = new AOCInput('');

  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(example1)).toBe(0);
    });
    it('Passes Part 2 Test', () => {
      expect(partTwo(example1)).toBe(0);
    });
    it('Passes Part 1', () => {
      expect(partOne(input)).toBe(0);
    });
    it('Passes Part 2', () => {
      expect(partTwo(input)).toBe(0);
    });
  });
});
