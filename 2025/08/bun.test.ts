import { getInputRaw } from '../../utils';

const input = await getInputRaw(2025, 8);

const sample = `162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689`;
describe('2025 Day 8 Rust', async () => {
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one(sample, 10)).toBe(40);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input, 1000)).toBe(81_536);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(part_two(sample)).toBe(25_272n);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(7_017_750_530n);
  }, 15_000);
});
