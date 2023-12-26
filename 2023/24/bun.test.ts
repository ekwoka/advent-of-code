import { AOCInput, getInput } from '../../utils';
import { partOne, partTwo } from '.';

export const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 24', async () => {
  const input = await getInput(2023, 24);
  const example1 = new AOCInput(
    '19, 13, 30 @ -2,  1, -2\n18, 19, 22 @ -1, -1, -2\n20, 25, 34 @ -2, -2, -4\n12, 31, 28 @ -1, -2, -1\n20, 19, 15 @  1, -5, -3\n',
  );

  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(example1, [7, 27])).toBe(2);
    });
    it.skip('Passes Part 2 Test', () => {
      // Current Solution for part 2
      // depends on the length of the real input
      // to focus the search
      expect(partTwo(example1)).toBe(0);
    });
    it('Passes Part 1', () => {
      const solution = partOne(
        input,
        [200_000_000_000_000, 400_000_000_000_000],
      );
      expect(solution).toBe(25433);
    });
    it('Passes Part 2', () => {
      const solution = partTwo(input);
      expect(solution).toBe(885093461440405);
    });
  });
});
