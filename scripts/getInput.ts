import { getInput } from '../utils';
const year = process.argv[2];
const day = process.argv[3];

const input = await getInput(year, day);

console.log(
  'Downloaded input for day',
  day,
  'of year',
  year,
  ':',
  input,
  'bytes',
);
