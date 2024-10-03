import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 13', async () => {
  const input = await getInput(2023, 13);
  const example1 = new AOCInput(
    '#.##..##.\n..#.##.#.\n##......#\n##......#\n..#.##.#.\n..##..##.\n#.#.##.#.\n\n#...##..#\n#....#..#\n..##..###\n#####.##.\n#####.##.\n..##..###\n#....#..#\n',
  );
  const example2 = new AOCInput(
    '..####...#.##..##\n####.#.......##..\n......##..#..##..\n#.....#####......\n.#.###...#.......\n..#.#..#.#...##..\n....##.##.#######\n###.##...#.#.##.#\n.##....###.##..##\n',
  );

  describe('in TypeScript', () => {
    it.skip('Passes Part 1 Test', () => {
      expect(partOne(example1)).toBe(405);
    });
    it.skip('Passes Part 2 Test', () => {
      expect(partTwo(example1)).toBe(400);
      expect(partTwo(example2)).toBe(16);
    });
    it.skip('Passes Part 1', () => {
      expect(partOne(input)).toBe(35691);
    });
    it.skip('Passes Part 2', () => {
      expect(partTwo(input)).toBe(39037);
    });
  });
});
