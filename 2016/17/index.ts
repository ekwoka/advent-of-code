import { createHash } from 'node:crypto';
import '@ekwoka/rust-ts/prelude';
import { range } from '@ekwoka/rust-ts';
import { Vec2 } from '../../utils/vec';

const md5 = (content: string) =>
  createHash('md5').update(content).digest('hex');

enum Door {
  Closed = 0,
  Open = 1,
}

const getDoors = (key: string) => {
  const hash = md5(key);
  return hash
    .iter()
    .take(4)
    .map((ch) => ('bcdef'.includes(ch) ? Door.Open : Door.Closed));
};
const neighbors = [Vec2.Y, Vec2.NEG_Y, Vec2.NEG_X, Vec2.X];
const neighborDirectionMap = {
  [Vec2.Y.toString()]: 'U',
  [Vec2.NEG_Y.toString()]: 'D',
  [Vec2.NEG_X.toString()]: 'L',
  [Vec2.X.toString()]: 'R',
};
export const partOne = (input: string) => {
  const destination = new Vec2(3, 0);
  const queue: [steps: number, position: Vec2, key: string][] = [
    [0, new Vec2(0, 3), input],
  ];
  while (queue.length) {
    const [steps, position, key] = queue.shift()!;
    if (position.eq(destination)) return key.replace(input, '');
    getDoors(key)
      .zip(neighbors)
      .filter(([door]) => Boolean(door))
      .map(([_, vec]) => [position.add(vec), vec])
      .filter(([pos]) => pos.x >= 0 && pos.x <= 3 && pos.y >= 0 && pos.y <= 3)
      .forEach(([position, vec]) =>
        queue.push([
          steps + 1,
          position,
          key + neighborDirectionMap[vec.toString()],
        ]),
      );
  }
  return '';
};
export const partTwo = (input: string) => {
  const destination = new Vec2(3, 0);
  const queue: [steps: number, position: Vec2, key: string][] = [
    [0, new Vec2(0, 3), input],
  ];
  let longest = -1;
  while (queue.length) {
    const [steps, position, key] = queue.shift()!;
    if (position.eq(destination)) {
      longest = steps;
      continue;
    }
    getDoors(key)
      .zip(neighbors)
      .filter(([door]) => Boolean(door))
      .map(([_, vec]) => [position.add(vec), vec])
      .filter(([pos]) => pos.x >= 0 && pos.x <= 3 && pos.y >= 0 && pos.y <= 3)
      .forEach(([position, vec]) =>
        queue.push([
          steps + 1,
          position,
          key + neighborDirectionMap[vec.toString()],
        ]),
      );
  }
  return longest;
};
