import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 21', async () => {
  const input = await getInput(2023, 21);
  const example1 = new AOCInput(
    '...........\n.....###.#.\n.###.##..#.\n..#.#...#..\n....#.#....\n.##..S####.\n.##..#...#.\n.......##..\n.##.#.####.\n.##..##.##.\n...........\n',
  );

  describe('in TypeScript', () => {
    it('Passes Part1 Tests', () => {
      expect(partOne(example1, 6)).toBe(16);
    });
    it('Passes Part 1', () => {
      expect(partOne(input, 64)).toBe(3658);
    });
    it('Passes Part 2', () => {
      const solution = partTwo(input, 26_501_365);
      expect(solution).toBe(608193767979991);
    });
  });
});
