import { getInputRaw } from '../../utils';

const input = await getInputRaw(2024, 5);
describe('2024 Day 5 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(
      part_one(`47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`),
    ).toBe(143);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(4_637);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(
      part_two(`47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`),
    ).toBe(123);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(6_370);
  }, 15_000);
});
