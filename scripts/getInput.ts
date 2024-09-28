import { type Day, type Year, getInput } from '../utils';
const year = Number(process.argv[2]) as Year;
const day = Number(process.argv[3]) as Day;

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
