import { partOne, partTwo } from '.';
import { getInputRaw } from '../../utils';

const input = await getInputRaw(2016, 22);
describe('2016 Day 22', async () => {
  it.skip('Passes Part 1 Test', () => {
    expect(
      partOne(`root@ebhq-gridcenter# df -h
Filesystem              Size  Used  Avail  Use%
/dev/grid/node-x0-y0     100T   25T    75T   25%
/dev/grid/node-x0-y1     100T   50T    50T   50%
/dev/grid/node-x0-y0      50T   25T    25T   50%
/dev/grid/node-x0-y1     100T   75T    25T   75%`),
    ).toBe(8);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(1_043);
  }, 15_000);
  it.skip('Passes Part 2 Test', () => {
    expect(
      partTwo(`root@ebhq-gridcenter# df -h
Filesystem            Size  Used  Avail  Use%
/dev/grid/node-x0-y0   10T    8T     2T   80%
/dev/grid/node-x0-y1   11T    6T     5T   54%
/dev/grid/node-x0-y2   32T   28T     4T   87%
/dev/grid/node-x1-y0    9T    7T     2T   77%
/dev/grid/node-x1-y1    8T    0T     8T    0%
/dev/grid/node-x1-y2   11T    7T     4T   63%
/dev/grid/node-x2-y0   10T    6T     4T   60%
/dev/grid/node-x2-y1    9T    8T     1T   88%
/dev/grid/node-x2-y2    9T    6T     3T   66%`),
    ).toBe(7);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(185);
  }, 15_000);
});

/*
  describe('2016 Day 22 Rust', async () => {
    const { part_one, part_two } = await import('./main.rs');
    it.skip('Passes Part 1 Test', () => {
      expect(part_one('')).toBe(0);
    }, 15_000);
    it('Passes Part 1', () => {
      expect(part_one(input)).toBe(0);
    }, 15_000);
    it.skip('Passes Part 2 Test', () => {
      expect(part_two('')).toBe(0);
    }, 15_000);
    it('Passes Part 2', () => {
      expect(part_two(input)).toBe(0);
    }, 15_000);
  });
*/
