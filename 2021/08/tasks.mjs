import input from './input.mjs';

/* const input = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce`; */

const inputLines = input.split('\n').map((line) => line.split(' | '));

function task1(inputLines) {
  let output;
  output = inputLines.reduce((acc, line) => {
    return (
      acc +
      line[1].split(' ').reduce((acc, word) => {
        if ([2, 3, 4, 7].includes(word.length)) acc += 1;
        return acc;
      }, 0)
    );
  }, 0);

  return output;
}

function processSegments(data) {
  let key = {};
  let unique = data.split(' ').reduce((acc, word) => {
    if (!acc.includes(word)) acc.push(word);
    return acc;
  }, []);
  unique.forEach((word) => {
    if (word.length == 2) key[1] = word;
    if (word.length == 3) key[7] = word;
    if (word.length == 4) key[4] = word;
    if (word.length == 7) key[8] = word;
  });

  unique.forEach((word) => {
    if (word.length == 5) {
      if (countMatching(word, key[1]) == 2) key[3] = word;
      if (countMatching(word, key[7]) == 2 && countMatching(word, key[4]) == 2)
        key[2] = word;
      if (countMatching(word, key[7]) == 2 && countMatching(word, key[4]) == 3)
        key[5] = word;
    }
    if (word.length == 6) {
      if (countMatching(word, key[4]) == 4) key[9] = word;
      if (countMatching(word, key[4]) == 3 && countMatching(word, key[1]) == 2)
        key[0] = word;
      if (countMatching(word, key[4]) == 3 && countMatching(word, key[1]) == 1)
        key[6] = word;
    }
  });

  return key;
}

function countMatching(a, b) {
  let [splitA, splitB] = [a.split(''), b.split('')];
  return splitA.reduce((acc, letter) => {
    if (splitB.includes(letter)) acc += 1;
    return acc;
  }, 0);
}

function decode(line, key) {
  let numbers = line.split(' ');
  let decodedNumbers = numbers.map((string) => {
    let value = Object.entries(key).find((entry) => {
      let [a, b] = [
        entry[1].length == string.length,
        countMatching(string, entry[1]) == string.length,
      ];
      return a && b;
    });
    return value[0];
  });

  return parseInt(decodedNumbers.join(''));
}

function task2(inputLines) {
  const lineValue = inputLines.map((line) => {
    let key = processSegments(line[0]);
    return decode(line[1], key);
  });
  return lineValue.reduce((acc, value) => acc + value);
}

console.log(task1(inputLines));

console.log(task2(inputLines));
