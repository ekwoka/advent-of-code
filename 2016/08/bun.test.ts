import { partOne, partTwo } from '.';
import { AOCInput, getInput, getInputRaw } from '../../utils';

describe.skip('2016 Day 8', async () => {
  const input = await getInput(2016, 8);
  it('Passes Part 1 Test', () => {
    expect(partOne(new AOCInput(''))).toBe(0);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe(0);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(partTwo(new AOCInput(''))).toBe(0);
  }, 15_000);
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe(0);
  }, 15_000);
});
describe('2016 Day 8 Rust', async () => {
  const input = await getInputRaw(2016, 8);
  const { part_one, part_two } = await import('./main.rs');
  it('Passes Part 1 Test', () => {
    expect(
      part_one(`rect 3x2
rotate column x=1 by 1
rotate row y=0 by 4
rotate column x=1 by 1
`),
    ).toBe(6);
  }, 15_000);
  it('Passes Part 1', () => {
    expect(part_one(input)).toBe(106);
  }, 15_000);
  it('Passes Part 2 Test', () => {
    expect(
      part_two(`rect 3x2
rotate column x=1 by 1
rotate row y=0 by 4
rotate column x=1 by 1
`),
    ).toBe(
      '    # #                                           \n# #                                               \n #                                                \n #                                                \n                                                  \n                                                  ',
    );
  }, 15_000);
  it('Passes Part 2', () => {
    expect(part_two(input)).toBe(
      ' ##  #### #    #### #     ##  #   #####  ##   ### \n#  # #    #    #    #    #  # #   ##    #  # #    \n#    ###  #    ###  #    #  #  # # ###  #    #    \n#    #    #    #    #    #  #   #  #    #     ##  \n#  # #    #    #    #    #  #   #  #    #  #    # \n ##  #    #### #### ####  ##    #  #     ##  ###  ',
    );
  }, 15_000);
});
