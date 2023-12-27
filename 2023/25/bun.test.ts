import { AOCInput, getInput } from '../../utils';
import { partOne } from '.';

export const toStr = (input: string) => new TextEncoder().encode(input);

describe('2023 Day 25', async () => {
  const input = await getInput(2023, 25);
  const example1 = new AOCInput(
    'jqt: rhn xhk nvd\nrsh: frs pzl lsr\nxhk: hfx\ncmg: qnr nvd lhk bvb\nrhn: xhk bvb hfx\nbvb: xhk hfx\npzl: lsr hfx nvd\nqnr: nvd\nntq: jqt hfx bvb xhk\nnvd: lhk\nlsr: lhk\nrzs: qnr cmg lsr rsh\nfrs: qnr lhk lsr\n',
  );

  describe('in TypeScript', () => {
    it('Passes Part 1 Test', () => {
      expect(partOne(example1)).toBe(54);
    });
    it('Passes Part 1', () => {
      const solution = partOne(input);
      expect(solution).toBe(543834);
    });
  });
});
