import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 18);

const sample = `5,4
4,2
4,5
3,0
2,1
6,3
2,4
1,5
0,6
3,3
2,6
5,1
1,2
5,5
2,5
6,5
1,4
0,4
6,4
1,1
6,1
1,0
0,5
1,6
2,0`;
describe('2024 Day 18 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample, 6, 12)).toBe(22);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input, 70, 1024)).toBe(306);
  }, 15_000);
  it.skip('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(0);
  }, 15_000);
  it.skip('Passes Part 2', () => {
    expect(part_two(input)).toBe(0);
  }, 15_000);
});
