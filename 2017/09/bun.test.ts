import { getInputRaw } from '../../utils';

const input = await getInputRaw(2017, 9);
describe('2017 Day 9 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(
      part_one('{{<!!>},{<!!>},{<!!>},{<!!>},{{<a!>},{<a!>},{<a!>},{<ab>}}}'),
    ).toBe(14);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(14_212);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two('{<{o"i!a,<{i<a>}')).toBe(10);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(6_569);
  }, 15_000);
});
