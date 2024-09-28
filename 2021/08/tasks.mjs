import input from './input.mjs';

const inputLines = input.split('\n').map((line) => line.split(' | '));

function task1(inputLines) {
  return inputLines.reduce((acc, line) => {
    return (
      acc +
      line[1].split(' ').reduce((acc, word) => {
        if ([2, 3, 4, 7].includes(word.length)) return acc + 1;
        return acc;
      }, 0)
    );
  }, 0);
}

function processSegments(data) {
  const key = {};
  const unique = data.split(' ').reduce((acc, word) => {
    if (!acc.includes(word)) acc.push(word);
    return acc;
  }, []);
  unique.forEach((word) => {
    if (word.length === 2) key[1] = word;
    if (word.length === 3) key[7] = word;
    if (word.length === 4) key[4] = word;
    if (word.length === 7) key[8] = word;
  });

  unique.forEach((word) => {
    if (word.length === 5) {
      if (countMatching(word, key[1]) === 2) key[3] = word;
      if (
        countMatching(word, key[7]) === 2 &&
        countMatching(word, key[4]) === 2
      )
        key[2] = word;
      if (
        countMatching(word, key[7]) === 2 &&
        countMatching(word, key[4]) === 3
      )
        key[5] = word;
    }
    if (word.length === 6) {
      if (countMatching(word, key[4]) === 4) key[9] = word;
      if (
        countMatching(word, key[4]) === 3 &&
        countMatching(word, key[1]) === 2
      )
        key[0] = word;
      if (
        countMatching(word, key[4]) === 3 &&
        countMatching(word, key[1]) === 1
      )
        key[6] = word;
    }
  });

  return key;
}

function countMatching(a, b) {
  const [splitA, splitB] = [a.split(''), b.split('')];
  return splitA.reduce((acc, letter) => {
    if (splitB.includes(letter)) return acc + 1;
    return acc;
  }, 0);
}

function decode(line, key) {
  const numbers = line.split(' ');
  const decodedNumbers = numbers.map((string) => {
    const value = Object.entries(key).find((entry) => {
      const [a, b] = [
        entry[1].length === string.length,
        countMatching(string, entry[1]) === string.length,
      ];
      return a && b;
    });
    return value[0];
  });

  return Number.parseInt(decodedNumbers.join(''));
}

function task2(inputLines) {
  const lineValue = inputLines.map((line) => {
    const key = processSegments(line[0]);
    return decode(line[1], key);
  });
  return lineValue.reduce((acc, value) => acc + value);
}

console.log(task1(inputLines));

console.log(task2(inputLines));
