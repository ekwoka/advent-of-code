import { reactions, start } from './input.mjs';

/* const start = 'NNCB';

const reactions = ['CH -> B', 'HH -> N', 'CB -> H', 'NH -> C', 'HB -> C', 'HC -> B', 'HN -> C', 'NN -> C', 'BH -> H', 'NC -> B', 'NB -> B', 'BN -> B', 'BB -> N', 'BC -> B', 'CC -> N', 'CN -> C']; */

const REACTIONS = reactions.reduce((acc, cur) => {
  const [a, b] = cur.split(' -> ');
  acc[a] = b;
  return acc;
}, {});

function react(start, steps) {
  let combinations = formCombinations(start.split(''));

  console.time('Reaction Time');
  while (steps--) {
    combinations = Object.entries(combinations).reduce(
      (acc, [combo, count]) => {
        const [oldPolymers, newPolymer] = [combo.split(''), REACTIONS[combo]];
        const newCombinations = formCombinations([
          oldPolymers[0],
          newPolymer,
          oldPolymers[1],
        ]);

        Object.entries(newCombinations).forEach(([combo, _]) => {
          acc[combo] = (acc[combo] || 0) + count;
        });

        return acc;
      },
      {},
    );
  }
  console.timeEnd('Reaction Time');

  const polymerCount = countPolymers(combinations);
  polymerCount[start.at(-1)]++;

  return Object.entries(polymerCount).reduce(
    (acc, [_polymer, count], i, chain) => {
      if (!acc[0] || count > acc[0]) acc[0] = count;
      if (!acc[1] || count < acc[1]) acc[1] = count;
      if (!chain[i + 1]) return acc[0] - acc[1];
      return acc;
    },
    [],
  );
}

function formCombinations(polymer) {
  return polymer.reduce((acc, cur, i, comp) => {
    const combo = cur + comp[i + 1];
    if (combo.length !== 2) return acc;
    acc[combo] = acc[combo] + 1 || 1;
    return acc;
  }, {});
}

function countPolymers(chain) {
  return Object.entries(chain).reduce((acc, [combo, count]) => {
    acc[combo[0]] = (acc[combo[0]] || 0) + count;
    return acc;
  }, {});
}

console.log('Reacting 10 steps');
console.log(react(start, 10));

console.log('Reacting 40 steps');
console.log(react(start, 40));

console.log('Reacting 100 steps');
console.log(react(start, 100));
