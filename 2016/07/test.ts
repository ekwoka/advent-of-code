import { AOCInput, getInput } from '../../utils';
const { part_one } = await import('./main.rs');
const input = await getInput(2016, 7);

console.log(
  part_one(
    `abba[mnop]qrst
abcd[bddb]xyyx
aaaa[qwer]tyui
ioxxoj[asdfgh]zxcvbn`,
  ),
);
console.log(part_one(input.valueOf()));
