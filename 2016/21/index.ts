import '@ekwoka/rust-ts/prelude';
import { AOCInput } from '../../utils';

export const partOne = (input: string, starting: string) => {
  const password = starting.split('');
  new AOCInput(input).lines().forEach((line) => {
    if (/^swap position/.test(line.valueOf())) {
      const [_, x, y] = line.match(/(\d+) with position (\d+)/)!;
      const tmp = password[x];
      password[x] = password[y];
      password[y] = tmp;
    } else if (/^swap letter/.test(line.valueOf())) {
      const [_, x, y] = line.match(/letter (\w) with letter (\w)/);
      const iX = password.indexOf(x);
      const iY = password.indexOf(y);
      password[iX] = y;
      password[iY] = x;
    } else if (/^rotate (?:left|right)/.test(line)) {
      const [_, dir, count] = line.match(/(left|right) (\d+)/);
      if (dir === 'left') {
        const end = password.splice(0, Number(count));
        password.push(...end);
      } else {
        const start = password.splice(
          password.length - Number(count),
          Number(count),
        );
        password.unshift(...start);
      }
    } else if (/^rotate based/.test(line)) {
      let idx = password.indexOf(line.match(/letter (\w)/)[1]);
      idx = (idx + (idx >= 4 ? 2 : 1)) % password.length;
      const start = password.splice(password.length - idx, idx);
      password.unshift(...start);
    } else if (/^reverse/.test(line)) {
      const [_, x, y] = line.match(/positions (\d+) through (\d+)/);
      const insert = password.splice(x, Number(y) + 1 - x);
      password.splice(x, 0, ...insert.reverse());
    } else if (/^move/.test(line)) {
      const [_, x, y] = line.match(/position (\d+) to position (\d+)/);
      const insert = password.splice(x, 1);
      password.splice(y, 0, ...insert);
    }
  });
  return password.join('');
};
export const partTwo = (input: string, starting: string) => {
  const password = starting.split('');
  new AOCInput(input)
    .lines()
    .reverse()
    .forEach((line) => {
      if (/^swap position/.test(line.valueOf())) {
        const [_, x, y] = line.match(/(\d+) with position (\d+)/)!;
        const tmp = password[x];
        password[x] = password[y];
        password[y] = tmp;
      } else if (/^swap letter/.test(line.valueOf())) {
        const [_, x, y] = line.match(/letter (\w) with letter (\w)/);
        const iX = password.indexOf(x);
        const iY = password.indexOf(y);
        password[iX] = y;
        password[iY] = x;
      } else if (/^rotate (?:left|right)/.test(line)) {
        const [_, dir, count] = line.match(/(left|right) (\d+)/);
        if (dir !== 'left') {
          const end = password.splice(0, Number(count));
          password.push(...end);
        } else {
          const start = password.splice(
            password.length - Number(count),
            Number(count),
          );
          password.unshift(...start);
        }
      } else if (/^rotate based/.test(line)) {
        const current = password.indexOf(line.match(/letter (\w)/)[1]);
        let idx = password.length - 1;
        while ((idx + (idx + (idx >= 4 ? 2 : 1))) % password.length !== current)
          idx--;
        idx = (idx + (idx >= 4 ? 2 : 1)) % password.length;
        const start = password.splice(idx, password.length - idx);
        password.unshift(...start);
      } else if (/^reverse/.test(line)) {
        const [_, x, y] = line.match(/positions (\d+) through (\d+)/);
        const insert = password.splice(x, Number(y) + 1 - x);
        password.splice(x, 0, ...insert.reverse());
      } else if (/^move/.test(line)) {
        const [_, x, y] = line.match(/position (\d+) to position (\d+)/);
        const insert = password.splice(y, 1);
        password.splice(x, 0, ...insert);
      }
    });
  return password.join('');
};
