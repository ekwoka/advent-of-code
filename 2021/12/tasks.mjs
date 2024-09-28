import input from './input.mjs';

function mapConnections(input) {
  const connections = {};
  input.forEach((connection) => {
    const [start, end] = connection.split('-');
    if (!connections[start]) connections[start] = [];
    if (!connections[end]) connections[end] = [];
    if (end !== 'start') connections[start].push(end);
    if (start !== 'start') connections[end].push(start);
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
      if (
        isLowerCase(nextNode) &&
        currentPath.includes(nextNode) &&
        (!allowMultiple || hasTwoVisits(currentPath))
      )
        return;
      if (nextNode === 'end') return completed.push([...currentPath, nextNode]);
      queue.push([...currentPath, nextNode]);
    });
  }
  return completed.length;
}

function hasTwoVisits(path) {
  const onlySmallCaves = path.filter((node) => isLowerCase(node));
  return new Set(onlySmallCaves).size !== onlySmallCaves.length;
}

function isLowerCase(letter) {
  return letter.toLowerCase() === letter;
}

console.log(findPaths(input));
console.log(findPaths(input, true));
