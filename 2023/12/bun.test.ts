import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 12', async () => {
  const input = await getInput(2023, 12);
  const example1 = new AOCInput(
    '???.### 1,1,3\n.??..??...?##. 1,1,3\n?#?#?#?#?#?#?#? 1,3,1,6\n????.#...#... 4,1,1\n????.######..#####. 1,6,5\n?###???????? 3,2,1\n',
  );

  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(example1)).toBe(21);
    });
    it('Passes Part 2 Test', () => {
      expect(partTwo(example1)).toBe(525152);
    });
    it('Passes Part 1', () => {
      const solution = partOne(input);
      expect(solution).toBe(7670);
    });
    it('Passes Part 2', () => {
      expect(partTwo(input)).toBe(157383940585037);
    });
  });
});
