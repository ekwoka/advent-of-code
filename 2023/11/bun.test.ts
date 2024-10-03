import { solveWithExpansionFactor } from '.';
import { AOCInput, getInput } from '../../utils';

const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 11', async () => {
  const input = await getInput(2023, 11);
  const example1 = new AOCInput(
    '...#......\n.......#..\n#.........\n..........\n......#...\n.#........\n.........#\n..........\n.......#..\n#...#.....\n',
  );

  describe('in TypeScript', () => {
    it.skip('Passes Part 1 Test', () => {
      expect(solveWithExpansionFactor(example1)).toBe(374);
    });
    it.skip('Passes Part 2 Test', () => {
      expect(solveWithExpansionFactor(example1, 10)).toBe(1030);
      expect(solveWithExpansionFactor(example1, 100)).toBe(8410);
    });
    it('Passes Part 1', () => {
      expect(solveWithExpansionFactor(input)).toBe(9_370_588);
    });
    it('Passes Part 2', () => {
      expect(solveWithExpansionFactor(input, 1_000_000)).toBe(746_207_878_188);
    });
  });
});
