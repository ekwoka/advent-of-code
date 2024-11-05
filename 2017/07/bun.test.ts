import { getInputRaw } from '../../utils';

const input = await getInputRaw(2017, 7);
describe('2017 Day 7 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(
      part_one(`pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)`),
    ).toBe('tknk');
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe('airlri');
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(
      part_two(`pbga (66)
xhth (57)
ebii (61)
havc (66)
ktlj (57)
fwft (72) -> ktlj, cntj, xhth
qoyq (66)
padx (45) -> pbga, havc, qoyq
tknk (41) -> ugml, padx, fwft
jptl (61)
ugml (68) -> gyxo, ebii, jptl
gyxo (61)
cntj (57)`),
    ).toBe(60);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(1_206);
  }, 15_000);
});
