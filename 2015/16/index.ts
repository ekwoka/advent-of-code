import type { AOCInput } from '../../utils';

const testResults = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1,
};
export const partOne = (input: AOCInput) => {
  const isCandidate = ([_, Sue]: [
    id: number,
    [keyof typeof testResults, number][],
  ]) =>
    Sue.every(
      ([key, value]) => testResults[key as keyof typeof testResults] === value,
    );
  return (
    input
      .lines()
      .filter(Boolean)
      .map((line) =>
        line
          .slice(line.indexOf(':') + 1)
          .split(',')
          .map((pair) => pair.split(':'))
          .map(([key, value]) => [key.trim(), Number.parseInt(value.trim())]),
      )
      .enumerate()
      .filter(isCandidate)
      .map(([num]) => num)
      .nth(0) + 1
  );
};
export const partTwo = (input: AOCInput) => {
  const isCandidate = ([_, Sue]: [
    id: number,
    [keyof typeof testResults, number][],
  ]) =>
    Sue.every(([key, value]) =>
      ['cats', 'trees'].includes(key)
        ? testResults[key as keyof typeof testResults] < value
        : ['pomeranians', 'goldfish'].includes(key)
          ? testResults[key as keyof typeof testResults] > value
          : testResults[key as keyof typeof testResults] === value,
    );
  return (
    input
      .lines()
      .filter(Boolean)
      .map((line) =>
        line
          .slice(line.indexOf(':') + 1)
          .split(',')
          .map((pair) => pair.split(':'))
          .map(([key, value]) => [key.trim(), Number.parseInt(value.trim())]),
      )
      .enumerate()
      .filter(isCandidate)
      .map(([num]) => num)
      .nth(0) + 1
  );
};
