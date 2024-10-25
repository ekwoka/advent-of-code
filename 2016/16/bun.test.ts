import {
  Day16,
  Day16Stream,
  checkSum,
  checkSumStream,
  generateData,
  generateDataStream,
} from '.';
import { getInputRaw } from '../../utils';

const input = await getInputRaw(2016, 16);
describe('2016 Day 16', async () => {
  it('Passes Part 1 Test', () => {
    expect(Day16('10000', 20)).toBe('01100');
  }, 15_000);
  it('Passes Part 1', () => {
    expect(Day16(input, 272)).toBe('10010110010011110');
  }, 15_000);
  it('Passes Part 2', () => {
    expect(Day16(input, 35_651_584)).toBe('01101011101100011');
  }, 15_000);
});

describe('2016 Day 16 Streaming', async () => {
  it.skip('generates same data', () => {
    expect(generateDataStream('10000', 20).map(String).sum()).toBe(
      generateData('10000', 20),
    );
    expect(generateDataStream(input, 272).map(String).sum()).toBe(
      generateData(input, 272),
    );
  });
  it.skip('generates same data for Part 2', () => {
    expect(generateDataStream(input, 35_651_584).map(String).sum()).toBe(
      generateData(input, 35_651_584),
    );
  });
  it.skip('generates same checksum', () => {
    let data = generateDataStream('10000', 20).collect();
    expect(checkSumStream(data.iter(), 20).sum()).toBe(
      checkSum(data.iter().map(String).sum()),
    );
    data = generateDataStream(input, 272).collect();
    expect(checkSumStream(data.iter(), 272).sum()).toBe(
      checkSum(data.iter().map(String).sum()),
    );
  });
  it.skip('generates same checksum for Part 2', () => {
    const data = generateDataStream(input, 35_651_584).collect();
    expect(checkSumStream(data.iter(), 35_651_584).sum()).toBe(
      checkSum(data.iter().map(String).sum()),
    );
  });
  it.skip('Passes Part 1 Test', () => {
    expect(Day16Stream('10000', 20)).toBe('01100');
  }, 15_000);
  it('Passes Part 1', () => {
    expect(Day16Stream(input, 272)).toBe('10010110010011110');
  }, 15_000);
  it('Passes Part 2', () => {
    expect(Day16Stream(input, 35_651_584)).toBe('01101011101100011');
  }, 15_000);
});

describe('2016 Day 16 Rust', async () => {
  const { part_one } = await import('./main.rs');
  it.skip('Passes Part 1 Test', () => {
    expect(part_one('10000', 20)).toBe('01100');
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input, 272)).toBe('10010110010011110');
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_one(input, 35_651_584)).toBe('01101011101100011');
  }, 15_000);
});
describe.skip('2016 Day 16 Rust Stream', async () => {
  const { part_one_stream } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(part_one_stream('10000', 20)).toBe('01100');
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one_stream(input, 272)).toBe('10010110010011110');
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_one_stream(input, 35_651_584)).toBe('01101011101100011');
  }, 15_000);
});
