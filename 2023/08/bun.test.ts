import { AOCInput, getInput } from '../../utils';
import { partOne, partTwo } from '.';

export const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 8', async () => {
  const input = await getInput(2023, 8);
  const example = new AOCInput(
    'RL\n\nAAA = (BBB, CCC)\nBBB = (DDD, EEE)\nCCC = (ZZZ, GGG)\nDDD = (DDD, DDD)\nEEE = (EEE, EEE)\nGGG = (GGG, GGG)\nZZZ = (ZZZ, ZZZ)\n',
  );
  const example2 = new AOCInput(
    'LR\n\n11A = (11B, XXX)\n11B = (XXX, 11Z)\n11Z = (11B, XXX)\n22A = (22B, XXX)\n22B = (22C, 22C)\n22C = (22Z, 22Z)\n22Z = (22B, 22B)\nXXX = (XXX, XXX)\n',
  );
  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(example)).toBe(2);
    });
    it('Passes Part 2 Test', () => {
      expect(partTwo(example2)).toBe(6);
    });
    it('Passes Part 1', () => {
      expect(partOne(input)).toBe(16343);
    });
    it('Passes Part 2', () => {
      expect(partTwo(input)).toBe(15299095336639);
    });
  });
});
