import '@ekwoka/rust-ts/prelude';
import type { AOCInput } from '../../utils';
import { range } from '@ekwoka/rust-ts';

export const partOne = (input: AOCInput, size: number) => {
  let data = input
    .chars()
    .filter((ch) => ['1', '0'].includes(ch))
    .collect();
  /*   while (data.length < size) {
    data = data
      .iter()
      .chain(['0'])
      .chain(
        data
          .iter()
          .reverse()
          .map((ch) => (ch === '0' ? '1' : '0')),
      )
      .collect();
  } */

  let output = range(0, size - 1).map((n) => {
    const iteration = (n / (input.length + 1)) | 0;
    const char = n % (input.length + 1);
    if (iteration % 2 === 0) {
      if (char === input.length) return (iteration / 2) % 2;
      return Number(input[char]);
    }
    if (char === input.length) {
      let steps = 0;
      let m = iteration + 1;
      while ((Math.log2(m) | 0) !== Math.log2(m) && m > 2)
        (m = 2 ** (Math.log2(m) | 0) - (m - 2 ** (Math.log2(m) | 0))), steps++;
      return steps % 2;
    }
    return input.at(-char - 1) === '1' ? 0 : 1;
  });

  let collapses = 0;
  while ((size / 2 ** collapses) % 2 === 0) {
    output = output.arrayChunks(2).map(([a, b]) => a ^ b ^ 1);
    collapses++;
  }
  return output.map(String).sum();
  /* data
    .iter()
    .arrayChunks(input.length + 1)
    .map((chunk) => chunk.slice(0, -1).join('') + ' ' + chunk.at(-1))
    .enumerate()
    .map(([n, str]) => {
      let steps = 0;
      let m = Math.ceil(n / 2) * 2;
      while ((Math.log2(m) | 0) !== Math.log2(m) && m > 2)
        (m = 2 ** (Math.log2(m) | 0) - (m - 2 ** (Math.log2(m) | 0))), steps++;
      return [
        n,
        str,
        steps,
        (n % 2 === 0 ? (n / 2) % 2 : steps % 2) === Number(str.at(-1)),
      ];
    })
    .forEach(console.log);
  data.length = size;

  while (data.length % 2 === 0)
    data = data
      .iter()
      .arrayChunks(2)
      .map(([a, b]) => (a === b ? '1' : '0'))
      .collect(); */
  return data.join('');
};
