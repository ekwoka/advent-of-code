import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 17', async () => {
  const input = await getInput(2023, 17);
  const example1 = new AOCInput(
    '2413432311323\n3215453535623\n3255245654254\n3446585845452\n4546657867536\n1438598798454\n4457876987766\n3637877979653\n4654967986887\n4564679986453\n1224686865563\n2546548887735\n4322674655533\n',
  );

  describe('in TypeScript', () => {
    it.skip('Passes Part 1 Test', () => {
      expect(partOne(example1)).toBe(102);
    });
    it.skip('Passes Part 2 Test', () => {
      expect(partTwo(example1)).toBe(94);
    });
    it('Passes Part 1', () => {
      const solution = partOne(input);
      expect(solution).toBe(638);
    });
    it('Passes Part 2', () => {
      const solution = partTwo(input);
      expect(solution).toBe(748);
    });
  });
});
