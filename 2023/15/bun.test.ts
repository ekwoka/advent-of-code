import { AOCInput /* getInput */ } from '../../utils';
import { partOne, partTwo } from '.';

export const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 15', /* async */ () => {
  /*   const input = new AOCInput(''); */
  const example1 = new AOCInput(
    'rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7',
  );

  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(example1)).toBe(1320);
    });
    it.skip('Passes Part 2 Test', () => {
      expect(partTwo(example1)).toBe(0);
    });
    it.skip('Passes Part 1', () => {
      expect(partOne(example1)).toBe(0);
    });
    it.skip('Passes Part 2', () => {
      expect(partTwo(example1)).toBe(0);
    });
  });
});
