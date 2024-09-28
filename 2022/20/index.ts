/**
 * --- Day 20: Grove Positioning System ---
 * Part 1: 00:33:21    684
 * Part 2: 01:21:50   1670
 * Just working with some linked lists. Have a list of numbers that need to be shuffled around a bunch of times.
 */
import { readFile } from 'node:fs/promises';

const input: string = (await readFile('input.txt', 'utf8')).trim();

// Input consists of positive and negative integers. Since they'll need to be shuffled around based on their values (-1 moves left 1 space, 2 moves right 2 spaces, etc.), a doubly-linked list makes sense as a data structure.
const encryptedFile = input.split('\n').map(Number);
const createLinkedList = (arr: number[]) => {
  const head: Node = {
    value: arr[0],
    next: null,
    prev: null,
  } as unknown as Node;
  const originalOrder = [head];
  let current = head;
  for (let i = 1; i < arr.length; i++) {
    current.next = {
      value: arr[i],
      next: null,
      prev: current,
    } as unknown as Node;
    current = current.next;
    originalOrder.push(current);
  }
  head.prev = current;
  current.next = head;
  return [head, originalOrder] as const;
};

// The process for decoding the input is called "mixing" where we move the elements through the list based on their value.
const mixNode = (node: Node, length: number) => {
  if (node.value === 0) return;
  const dir = Math.abs(node.value) / node.value === -1 ? 'prev' : 'next';
  // For part 2, this modulo is very important, as the numbers become very large and would take a long time to step through. But with this adjustment we can skip a lot of steps that would return the node to the same place
  let steps = Math.abs(node.value) % (length - 1);
  if (steps === 0) return;
  let { prev, next } = node;
  prev.next = next;
  next.prev = prev;
  while (steps--) {
    if (dir === 'prev') {
      next = prev;
      prev = prev.prev;
    } else {
      prev = next;
      next = next.next;
    }
  }
  node.prev = prev;
  node.next = next;
  prev.next = node;
  next.prev = node;
  return;
};

// Nodes are always mixed in the same order, the one in which they appear in the original input.
const mixList = (originalList: Node[], length: number) => {
  for (const node of originalList) mixNode(node, length);
};

const findZero = (head: Node) => {
  let current = head;
  while (current.value !== 0) current = current.next;
  return current;
};

// The final output involves the values at 1000, 2000, 3000 steps after the zero node.
const getCoords = (head: Node) => {
  const coords: number[] = [];
  for (let steps = 1; steps <= 3000; steps++) {
    head = head.next;
    if (!(steps % 1000)) coords.push(head.value);
  }
  return coords;
};

// Part one just mixes the nodes once
const PartOne = (input: number[]) => {
  const [head, originalList] = createLinkedList(input);
  mixList(originalList, input.length);
  return getCoords(findZero(head)).reduce((a, b) => a + b);
};

// Part two both multiplies the values by an arbitrarily large number, and cycles through mixing the list 10 times
const PartTwo = (input: number[]) => {
  console.time('Part Two');
  const [head, originalList] = createLinkedList(
    input.map((val) => val * 811_589_153),
  );
  for (let i = 0; i < 10; i++) mixList(originalList, input.length);
  console.timeEnd('Part Two');
  return getCoords(findZero(head)).reduce((a, b) => a + b);
};

console.log('Part One:', PartOne(encryptedFile));
console.log('Part Two:', PartTwo(encryptedFile));

type Node = {
  value: number;
  next: Node;
  prev: Node;
};
