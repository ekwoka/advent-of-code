import { range } from '@ekwoka/rust-ts';
import '@ekwoka/rust-ts/prelude';

enum Tile {
  Safe = '.',
  Trap = '^',
}
export const partOne = (input: string, rows: number) => {
  const initial = input
    .iter()
    .map((ch) => (ch === Tile.Safe ? Tile.Safe : Tile.Trap))
    .collect();
  return [initial]
    .iter()
    .chain(
      range(1, rows - 1).scan((state) => {
        return (state[0] = [Tile.Safe, ...state[0], Tile.Safe]
          .iter()
          .window(3)
          .map(([L, _, R]) => (L === R ? Tile.Safe : Tile.Trap))
          .collect());
      }, initial),
    )
    .flat()
    .filter((tile) => tile !== Tile.Trap)
    .count();
};
