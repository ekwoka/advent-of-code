import { AOCInput, getInput } from '../../utils';
import { partOne, partTwo } from '.';

export const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 6', async () => {
  const input = await getInput(2023, 6);
  const example = new AOCInput('Time:      7  15   30\nDistance:  9  40  200');
  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(example)).toBe(288);
    });
    it('Passes Part 2 Test', () => {
      expect(partTwo(example)).toBe(71503n);
    });
    it('Passes Part 1', () => {
      expect(partOne(input)).toBe(840336);
    });
    it('Passes Part 2', () => {
      expect(partTwo(input)).toBe(41382569n);
    });
  });
});
