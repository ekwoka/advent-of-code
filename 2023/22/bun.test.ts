import { AOCInput, getInput } from '../../utils';
import { partOne, partTwo } from '.';

export const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 22', async () => {
  const input = await getInput(2023, 22);
  const example1 = new AOCInput(
    '1,0,1~1,2,1\n0,0,2~2,0,2\n0,2,3~2,2,3\n0,0,4~0,2,4\n2,0,5~2,2,5\n0,1,6~2,1,6\n1,1,8~1,1,9\n',
  );

  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(example1)).toBe(5);
    });
    it('Passes Part 2 Test', () => {
      expect(partTwo(example1)).toBe(7);
    });
    it('Passes Part 1', () => {
      const solution = partOne(input);
      expect(solution).toBe(389);
    });
    it('Passes Part 2', () => {
      expect(partTwo(input)).toBe(70609);
    });
  });
});
