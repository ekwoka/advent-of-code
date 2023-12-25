import { AOCInput, getInput } from '../../utils';
import { partOne, partTwo } from '.';

export const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 23', async () => {
  const input = await getInput(2023, 23);
  const example1 = new AOCInput(
    '#.#####################\n#.......#########...###\n#######.#########.#.###\n###.....#.>.>.###.#.###\n###v#####.#v#.###.#.###\n###.>...#.#.#.....#...#\n###v###.#.#.#########.#\n###...#.#.#.......#...#\n#####.#.#.#######.#.###\n#.....#.#.#.......#...#\n#.#####.#.#.#########v#\n#.#...#...#...###...>.#\n#.#.#v#######v###.###v#\n#...#.>.#...>.>.#.###.#\n#####v#.#.###v#.#.###.#\n#.....#...#...#.#.#...#\n#.#########.###.#.#.###\n#...###...#...#...#.###\n###.###.#.###v#####v###\n#...#...#.#.>.>.#.>.###\n#.###.###.#.###.#.#v###\n#.....###...###...#...#\n#####################.#\n',
  );

  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(example1)).toBe(94);
    });
    it('Passes Part 2 Test', () => {
      expect(partTwo(example1)).toBe(154);
    });
    it('Passes Part 1', () => {
      expect(partOne(input)).toBe(2162);
    });
    it('Passes Part 2', () => {
      expect(partTwo(input)).toBe(0);
    });
  });
});
