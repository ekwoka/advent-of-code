import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 18', async () => {
  const input = await getInput(2023, 18);
  const example1 = new AOCInput(
    'R 6 (#70c710)\nD 5 (#0dc571)\nL 2 (#5713f0)\nD 2 (#d2c081)\nR 2 (#59c680)\nD 2 (#411b91)\nL 5 (#8ceee2)\nU 2 (#caa173)\nL 1 (#1b58a2)\nU 2 (#caa171)\nR 2 (#7807d2)\nU 3 (#a77fa3)\nL 2 (#015232)\nU 2 (#7a21e3)\n',
  );

  describe('in TypeScript', () => {
    it.skip('Passes Part 1 Test', () => {
      expect(partOne(example1)).toBe(62);
    });
    it.skip('Passes Part 2 Test', () => {
      expect(partTwo(example1)).toBe(952_408_144_115);
    });
    it('Passes Part 1', () => {
      const solution = partOne(input);
      expect(solution).toBe(46_334);
    });
    it.skip('Passes Part 2', () => {
      expect(partTwo(input)).toBe(102_000_662_718_092);
    });
  });
});
