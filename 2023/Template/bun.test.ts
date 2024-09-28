import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 1', async () => {
  const input = await getInput(2023, 1);
  const example1 = new AOCInput('');

  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(example1)).toBe(0);
    });
    it('Passes Part 2 Test', () => {
      expect(partTwo(example1)).toBe(0);
    });
    it('Passes Part 1', () => {
      expect(partOne(input)).toBe(0);
    });
    it('Passes Part 2', () => {
      expect(partTwo(input)).toBe(0);
    });
  });
});
