import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 14);

const sample = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;
describe('2024 Day 14 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample, 11, 7)).toBe(12);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input, 101, 103)).toBe(214_109_808);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(7_687);
  }, 15_000);
});
