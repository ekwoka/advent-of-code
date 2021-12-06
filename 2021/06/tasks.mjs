// Lanternfish: Map growth of lanternfish population

// REAL DATA
 import input from './input.mjs'

// TEST DATA
// const input = [3, 4, 3, 1, 2];

// Task 1 was simple and just does basic loops to track every single fish. Easy to write and read, but not very efficient. It's slow and memory intensive.

function simulateLife1(input) {
  let days = 80;
  let population = input;

  while (days > 0) {
    population = population.flatMap((num) => {
      if (num > 0) return num - 1;
      return [6, 8];
    });
    days--;
  }
  return population.length;
}

// Task 2 is impossible to do with the method used in task 1. So instead this groups fish on the same cycle together and treats them as a single fish. This method takes less time to do 256 days than the last took to do 80 days

function simulateLife2(input) {
  let population = objectifyFish(input);
  let days = 80;

  while (days > 0) {
    population = Object.entries(population).reduce((acc, [daysTilSpawn, Number]) => {
      if (daysTilSpawn > 0) {
          if (!acc[daysTilSpawn - 1]) acc[daysTilSpawn - 1] = 0;
        acc[daysTilSpawn - 1] += Number;
      } else {
        if(!acc['6']) acc['6'] = 0;
        acc['6'] += Number;
        acc['8'] = Number;
      }
      return acc;
    }, {});
    days--;
  }

  return Object.values(population).reduce((acc, val) => acc + val);
}

function objectifyFish(input) {
  return input.reduce((acc, fish) => {
    if (!acc[fish]) acc[fish] = 0;
    acc[fish]++;
    return acc;
  }, {});
}

console.time('simulateLife');
console.log('80 Day Population:', simulateLife1(input));
console.timeEnd('simulateLife');

console.time('simulateLife2');
console.log('256 Day Population:', simulateLife2(input));
console.timeEnd('simulateLife2');
