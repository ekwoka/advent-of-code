import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 10', async () => {
  const input = await getInput(2023, 10);
  const example1 = new AOCInput('.....\n.S-7.\n.|.|.\n.L-J.\n.....\n');
  const example2 = new AOCInput('..F7.\n.FJ|.\nSJ.L7\n|F--J\nLJ...\n');
  const example3 = new AOCInput(
    '...........\n.S-------7.\n.|F-----7|.\n.||.....||.\n.||.....||.\n.|L-7.F-J|.\n.|..|.|..|.\n.L--J.L--J.\n...........\n',
  );
  const example4 = new AOCInput(
    '.F----7F7F7F7F-7....\n.|F--7||||||||FJ....\n.||.FJ||||||||L7....\nFJL7L7LJLJ||LJ.L-7..\nL--J.L7...LJS7F-7L7.\n....F-J..F7FJ|L7L7L7\n....L7.F7||L7|.L7L7|\n.....|FJLJ|FJ|F7|.LJ\n....FJL-7.||.||||...\n....L---J.LJ.LJLJ...\n',
  );

  describe('in TypeScript', () => {
    it.skip('Passes Part 1 Test', () => {
      expect(partOne(example1)).toBe(4);
      expect(partOne(example2)).toBe(8);
    });
    it.skip('Passes Part 2 Test', () => {
      expect(partTwo(example3)).toBe(4);
      expect(partTwo(example4)).toBe(8);
    });
    it('Passes Part 1', () => {
      expect(partOne(input)).toBe(7030);
    });
    it('Passes Part 2', () => {
      expect(partTwo(input)).toBe(285);
    });
  });
});
