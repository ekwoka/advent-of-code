import { AOCInput, getInput } from '../../utils';
import { partOne, partTwo } from '.';

export const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 15', async () => {
  const input = await getInput(2023, 15);
  const example1 = new AOCInput(
    'rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7',
  );

  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(example1)).toBe(1320);
    });
    it('Passes Part 2 Test', () => {
      expect(partTwo(example1)).toBe(145);
    });
    it('Passes Part 1', () => {
      expect(partOne(input)).toBe(519603);
    });
    it('Passes Part 2', () => {
      expect(partTwo(input)).toBe(244342);
    });
  });
});
