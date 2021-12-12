import input from './input.mjs';

// const input = ['start-A','start-b','A-c','A-b','b-d','A-end','b-end'];

const inputB = ['dc-end','HN-start','start-kj','dc-start','dc-HN','LN-dc','HN-end','kj-sa','kj-HN','kj-dc']

const inputC = ['fs-end','he-DX','fs-he','start-DX','pj-DX','end-zg','zg-sl','zg-pj','pj-he','RW-he','fs-DX','pj-RW','zg-RW','start-pj','he-WI','zg-he','pj-fs','start-RW'];

function mapConnections(input) {
  const connections = {};
  input.forEach((connection) => {
    const [start, end] = connection.split('-');
    if (!connections[start]) connections[start] = [];
    if (!connections[end]) connections[end] = [];
    if (end != 'start') connections[start].push(end);
    if (start != 'start') connections[end].push(start);
  });
  return connections;
}

function findPaths(input, allowMultiple) {
  const connections = mapConnections(input);
  const queue = [['start']];
  const completed = [];
  while (queue.length) {
    const currentPath = queue.pop();
    const currentNode = currentPath.at(-1);
    connections[currentNode].forEach((nextNode) => {
      if (isLowerCase(nextNode) && currentPath.includes(nextNode) && (!allowMultiple || hasTwoVisits(currentPath))) return;
      if (nextNode === 'end') return completed.push([...currentPath, nextNode]);
      queue.push([...currentPath, nextNode]);
    });
  }
  return completed.length;
}

function hasTwoVisits(path) {
    const onlySmallCaves = path.filter(node => isLowerCase(node));
  return new Set(onlySmallCaves).size !== onlySmallCaves.length;
}

function isLowerCase(letter) {
  return letter.toLowerCase() === letter;
}

console.log(findPaths(input));
console.log(findPaths(input, true));