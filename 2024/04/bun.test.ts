import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 4);
describe('2024 Day 4 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(
      part_one(`MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`),
    ).toBe(18);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(2_500);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(
      part_two(`MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`),
    ).toBe(9);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(1_933);
  }, 15_000);
});
