import input from './input.mjs';

// const input = ['5483143223','2745854711','5264556173','6141336146','6357385478','4167524645','2176841721','6882881134','4846848554','5283751526']

const offsets = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

function task1(input) {
  let swarm = [
    ...input.map((row) => row.split('').map((octo) => parseInt(octo))),
  ];
  let flashes = 0;
  let steps = 100;
  while (steps--) {
    [flashes, swarm] = step(flashes, [...swarm]);
  }
  return flashes;
}

function task2(input) {
  let swarm = [
    ...input.map((row) => row.split('').map((octo) => parseInt(octo))),
  ];
  let steps = 0;
  while (synced(swarm) == false) {
    swarm = step(0, [...swarm])[1];
    steps++;
  }
  return steps;
}

function step(flashes, swarm) {
  swarm = swarm.map((row) => row.map((octo) => octo + 1));
  while (hasNine(swarm)) {
    for (let y = 0; y < swarm.length; y++) {
      for (let x = 0; x < swarm[y].length; x++) {
        if (swarm[y][x] > 9) {
          flashes++;
          swarm[y][x] = -10;
          offsets.forEach(([xOffset, yOffset]) => {
            if (swarm[y + yOffset] && swarm[y + yOffset][x + xOffset])
              swarm[y + yOffset][x + xOffset]++;
          });
        }
      }
    }
    swarm = swarm.map((row) => row.map((octo) => (octo < 0 ? 0 : octo)));
  }

  return [flashes, swarm];
}

function hasNine(swarm) {
  return swarm.some((row) => row.some((octo) => octo > 9));
}

function synced(swarm) {
  return swarm.every((row) => row.every((octo) => octo === 0));
}

console.log(task1(input));
console.log(task2(input));
