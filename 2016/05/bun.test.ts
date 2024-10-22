import { partOne, partTwo, partTwoNaive, partTwoOptimized } from '.';
import { AOCInput, getInput } from '../../utils';
const input = await getInput(2016, 5);
/**
 * This is an initial optimized approach using Bitwise operations
 * directly on the md5 buffer. Part 2 takes 22 seconds
 */
describe('2016 Day 5 Bitwise', async () => {
  it.skip('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput('abc'))).toBe('18f47a30');
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe('d4cd2ee1');
  }, 15_000);
  it.skip('Passes Part 2 Test', () => {
    expect(partTwo(new AOCInput('abc'))).toBe('05ace8e3');
  }, 15_000);
  it.skip('Passes Part 2', () => {
    expect(partTwo(input)).toBe('f2c730e5');
  }, 15_000);
});

/**
 * This is further optimized. Instead of using bitwise operations
 * it just directly accesses the bytes in the buffer to check them.
 * Part 2 takes 16 seconds
 */
describe('2016 Day 5 Optimized', async () => {
  it.skip('Passes Part 2 Test', () => {
    expect(partTwoOptimized(new AOCInput('abc'))).toBe('05ace8e3');
  }, 15_000);
  it('Passes Part 2', () => {
    expect(partTwoOptimized(input)).toBe('f2c730e5');
  }, 15_000);
});

/**
 * These do the naive string checking and manipulation
 * They are slow. Solving part 2 takes 60 seconds.
 */
describe.skip('2016 Day 5 Naive Strings', () => {
  it('Passes Part 2 Test Naive', () => {
    expect(partTwoNaive(new AOCInput('abc'))).toBe('05ace8e3');
  }, 15_000);
  it('Passes Part 2 Naive', () => {
    expect(partTwoNaive(input)).toBe('f2c730e5');
  }, 15_000);
});
