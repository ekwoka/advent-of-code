import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 9', async () => {
  const input = await getInput(2023, 9);
  const example = new AOCInput(
    '0 3 6 9 12 15\n1 3 6 10 15 21\n10 13 16 21 30 45\n',
  );
  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(example)).toBe(114);
    });
    it('Passes Part 2 Test', () => {
      expect(partTwo(example)).toBe(2);
    });
    it('Passes Part 1', () => {
      expect(partOne(input)).toBe(1757008019);
    });
    it('Passes Part 2', () => {
      expect(partTwo(input)).toBe(995);
    });
  });
});
