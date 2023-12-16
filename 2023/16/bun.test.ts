import { AOCInput, getInput } from '../../utils';
import { partOne, partTwo } from '.';

export const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 16', async () => {
  const input = await getInput(2023, 16);
  const example1 = new AOCInput(
    String.raw`.|...\....
|.-.\.....
.....|-...
........|.
..........
.........\
..../.\\..
.-.-/..|..
.|....-|.\
..//.|....`,
  );

  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(example1)).toBe(46);
    });
    it('Passes Part 2 Test', () => {
      expect(partTwo(example1)).toBe(51);
    });
    it('Passes Part 1', () => {
      expect(partOne(input)).toBe(7860);
    });
    it('Passes Part 2', () => {
      expect(partTwo(input)).toBe(8331);
    });
  });
});
