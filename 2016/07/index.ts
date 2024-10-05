import '@ekwoka/rust-ts/prelude';
import type { AOCInput } from '../../utils';

const hypernetABBA = /\[[^\]]*?(\w)(?!:\1)(\w)\2\1.*?\]/;
const ABBA = /(\w)(?!\1)(\w)\2\1/;
export const partOne = (input: AOCInput) => {
  return input
    .lines()
    .filter(Boolean)
    .map((line) => line.valueOf())
    .filter((line) => ABBA.test(line))
    .filter((line) => !hypernetABBA.test(line))
    .count();
};

const SSL_ABABAB =
  /(?:(\w)(?!\1)(\w)\1(?=[^\]]*?\[).*?\[[^\]]*?\2\1\2[^\]]*?\]|\[[^\]]*?(\w)(?!\3)(\w)\3[^\]]*?\].*?\4\3\4(?=[^\]]*?(?:\[|$)))/;
export const partTwo = (input: AOCInput) => {
  return input
    .lines()
    .filter(Boolean)
    .map((line) => line.valueOf())
    .filter((line) => SSL_ABABAB.test(line))
    .count();
};
