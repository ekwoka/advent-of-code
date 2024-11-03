import { getInputRaw } from '../../utils';

const input = await getInputRaw(2017, 4);

describe('2017 Day 4 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(
      part_one(`aa bb cc dd ee
aa bb cc dd aa
aa bb cc dd aaa`),
    ).toBe(2);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(455);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(
      part_two(`abcde xyz ecdab
a ab abc abd abf abj`),
    ).toBe(1);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(186);
  }, 15_000);
});
