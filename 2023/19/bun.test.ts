import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 19', async () => {
  const input = await getInput(2023, 19);
  const example1 = new AOCInput(
    'px{a<2006:qkq,m>2090:A,rfg}\npv{a>1716:R,A}\nlnx{m>1548:A,A}\nrfg{s<537:gd,x>2440:R,A}\nqs{s>3448:A,lnx}\nqkq{x<1416:A,crn}\ncrn{x>2662:A,R}\nin{s<1351:px,qqz}\nqqz{s>2770:qs,m<1801:hdj,R}\ngd{a>3333:R,R}\nhdj{m>838:A,pv}\n\n{x=787,m=2655,a=1222,s=2876}\n{x=1679,m=44,a=2067,s=496}\n{x=2036,m=264,a=79,s=2244}\n{x=2461,m=1339,a=466,s=291}\n{x=2127,m=1623,a=2188,s=1013}\n',
  );

  describe('in TypeScript', () => {
    it.skip('Passes Part 1 Test', () => {
      expect(partOne(example1)).toBe(19114);
    });
    it.skip('Passes Part 2 Test', () => {
      const solution = partTwo(example1);
      expect(solution).toBe(167409079868000);
    });
    it('Passes Part 1', () => {
      expect(partOne(input)).toBe(476889);
    });
    it('Passes Part 2', () => {
      const solution = partTwo(input);
      expect(solution).toBe(132380153677887);
    });
  });
});
