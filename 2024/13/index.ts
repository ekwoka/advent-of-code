import '@ekwoka/rust-ts/prelude';
import { Vec2 } from '../../utils/vec';

export const partOne = (input: string) => {
  return input
    .split('\n\n')
    .iter()
    .map((machine) => {
      const [buttonA, buttonB, prize] = machine
        .split('\n')
        .iter()
        .map((line) => line.matchAll(/\d+/g).map(Number))
        .map(([x, y]) => new Vec2(x, y));
      let aPresses = 0;
      while (
        aPresses <= 100 &&
        prize.sub(buttonA.scale(aPresses)).normalize() !== buttonB.normalize()
      ) {
        aPresses++;
      }
      console.log('Press A: ', aPresses);
      console.log(
        'Press B: ',
        prize.sub(buttonA.scale(aPresses)).length() / buttonB.length(),
      );
      0;
    })
    .count();

  return 0;
};
export const partTwo = (input: string) => {
  return 0;
};
