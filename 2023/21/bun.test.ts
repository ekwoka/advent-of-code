import { AOCInput, getInput } from '../../utils';
import { partOne } from '.';

export const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 21', async () => {
  const input = await getInput(2023, 21);
  const example1 = new AOCInput(
    '...........\n.....###.#.\n.###.##..#.\n..#.#...#..\n....#.#....\n.##..S####.\n.##..#...#.\n.......##..\n.##.#.####.\n.##..##.##.\n...........\n',
  );

  describe('in TypeScript', () => {
    it('Passes Tests', () => {
      expect(partOne(example1, 6)).toBe(16);
      expect(partOne(example1, 10)).toBe(50);
      expect(partOne(example1, 50)).toBe(1594);
      expect(partOne(example1, 100)).toBe(6536);
      expect(partOne(example1, 500)).toBe(167004);
      expect(partOne(example1, 1000)).toBe(668697);
      expect(partOne(example1, 5000)).toBe(16733044);
    });
    it('Passes Part 1', () => {
      expect(partOne(input, 64)).toBe(3658);
    });
    it('Passes Part 2', () => {
      const solution = partOne(input, 26501365);
      expect(solution).toBeGreaterThan(586_497_430_824_373);
      expect(solution).toBeGreaterThan(604_095_220_153_985);
      expect(solution).toBe(0);
    });
  });
});
