import { AOCInput, getInput } from '../../utils';
import { partOne, partTwo } from '.';

export const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 14', async () => {
  const input = await getInput(2023, 14);
  const example1 = new AOCInput(
    'O....#....\nO.OO#....#\n.....##...\nOO.#O....O\n.O.....O#.\nO.#..O.#.#\n..O..#O..O\n.......O..\n#....###..\n#OO..#....\n',
  );

  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(example1)).toBe(136);
    });
    it('Passes Part 2 Test', () => {
      expect(partTwo(example1)).toBe(64);
    });
    it('Passes Part 1', () => {
      expect(partOne(input)).toBe(112773);
    });
    it('Passes Part 2', () => {
      expect(partTwo(input)).toBe(98894);
    });
  });
});
