import '@ekwoka/rust-ts/prelude';
import { type RustIterator, range } from '@ekwoka/rust-ts';

export const Day16 = (input: string, size: number) => {
  let data = input
    .iter()
    .filter((ch) => ['1', '0'].includes(ch))
    .sum();
  data = generateData(data, size);

  return checkSum(data);
};

export const generateData = (data: string, size: number) => {
  while (data.length < size)
    data = data
      .iter()
      .chain(['0'])
      .chain(
        data
          .iter()
          .reverse()
          .map((ch) => (ch === '0' ? '1' : '0')),
      )
      .sum();
  return data.slice(0, size);
};

export const checkSum = (data: string) => {
  while (data.length % 2 === 0)
    data = data
      .iter()
      .arrayChunks(2)
      .map(([a, b]) => (a === b ? '1' : '0'))
      .sum();
  return data;
};

export const Day16Stream = (input: string, size: number) => {
  const data = generateDataStream(input, size);
  return checkSumStream(data, size).sum();
};

export const generateDataStream = (input: string, size: number) => {
  return range(0, size - 1).map((n) => {
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
};

export const checkSumStream = (data: RustIterator<number>, size: number) => {
  let collapses = 0;
  while ((size / 2 ** collapses) % 2 === 0) {
    data = data.arrayChunks(2).map(([a, b]) => a ^ b ^ 1);
    collapses++;
  }
  return data.map(String);
};
