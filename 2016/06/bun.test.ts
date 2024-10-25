import { partOne, partTwo } from '.';
import { AOCInput, getInput } from '../../utils';

describe('2016 Day 6', async () => {
  const input = await getInput(2016, 6);
  it.skip('Passes Part 1 Test', () => {
    expect(
      partOne(
        new AOCInput(`eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev
sdttsa
rasrtv
nssdts
ntnada
svetve
tesnvt
vntsnd
vrdear
dvrsen
enarar`),
      ),
    ).toBe('easter');
  }, 15_000);
  it('Passes Part 1', () => {
    expect(partOne(input)).toBe('tzstqsua');
  }, 15_000);
  it.skip('Passes Part 2 Test', () => {
    expect(
      partTwo(
        new AOCInput(`eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev
sdttsa
rasrtv
nssdts
ntnada
svetve
tesnvt
vntsnd
vrdear
dvrsen
enarar`),
      ),
    ).toBe('advent');
  }, 15_000);
  it('Passes Part 2', () => {
    expect(partTwo(input)).toBe('myregdnr');
  }, 15_000);
});
