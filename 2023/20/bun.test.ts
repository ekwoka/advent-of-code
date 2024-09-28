import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 20', async () => {
  const input = await getInput(2023, 20);
  const example1 = new AOCInput(
    'broadcaster -> a, b, c\n%a -> b\n%b -> c\n%c -> inv\n&inv -> a\n',
  );
  const example2 = new AOCInput(
    'broadcaster -> a\n%a -> inv, con\n&inv -> b\n%b -> con\n&con -> output\n',
  );

  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(example1)).toBe(32000000);
      expect(partOne(example2)).toBe(11687500);
    });
    it('Passes Part 1', () => {
      expect(partOne(input)).toBe(800830848);
    });
    it('Passes Part 2', () => {
      expect(partTwo(input)).toBe(244055946148853);
    });
  });
});
