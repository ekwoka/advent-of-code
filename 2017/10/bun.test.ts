import { getInputRaw } from '../../utils';

const input = await getInputRaw(2017, 10);
describe('2017 Day 10 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one('3,4,1,5', 5)).toBe(12);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input, 256)).toBe(38_628);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two('')).toBe('a2582a3a0e66e6e86e3812dcb672a272');
    expect(part_two('AoC 2017')).toBe('33efeb34ea91902bb2f59c9920caa6cd');
    expect(part_two('1,2,3')).toBe('3efbe78a8d82f29979031a4aa0b16a9d');
    expect(part_two('1,2,4')).toBe('63960835bcdc130f0b66d7ff4f6a5a8e');
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe('e1462100a34221a7f0906da15c1c979a');
  }, 15_000);
});
