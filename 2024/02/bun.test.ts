import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 2);
describe('2024 Day 2 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(
      part_one(`7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`),
    ).toBe(2);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(432);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(
      part_two(`7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9`),
    ).toBe(4);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(488);
  }, 15_000);
});
