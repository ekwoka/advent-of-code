import { determineCombinations, fewestContainers } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2015 Day 17', async () => {
  const input = await getInput(2015, 17);
  const example1 = new AOCInput('20\n15\n10\n5\n5');

  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(determineCombinations(example1, 25)).toBe(4);
    });
    it('Passes Part 2 Test', () => {
      expect(fewestContainers(example1, 25)).toBe(3);
    });
    it('Passes Part 1', () => {
      expect(determineCombinations(input, 150)).toBe(654);
    });
    it('Passes Part 2', () => {
      expect(fewestContainers(input, 150)).toBe(57);
    });
  });
});
