import { RustIterator } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

const Shop = {
  Weapons: {
    'Dagger      ': [8, 4, 0],
    'Shortsword ': [10, 5, 0],
    'Warhammer  ': [25, 6, 0],
    'Longsword  ': [40, 7, 0],
    'Greataxe   ': [74, 8, 0],
  },
  Armor: {
    'Leather    ': [13, 0, 1],
    'Chainmail  ': [31, 0, 2],
    'Splintmail ': [53, 0, 3],
    'Bandedmail ': [75, 0, 4],
    'Platemail ': [102, 0, 5],
  },
  Rings: {
    'Damage +1  ': [25, 1, 0],
    'Damage +2  ': [50, 2, 0],
    'Damage +3 ': [100, 3, 0],
    'Defense +1 ': [20, 0, 1],
    'Defense +2 ': [40, 0, 2],
    'Defense +3 ': [80, 0, 3],
  },
};

export const partOne = (input: AOCInput) => {
  const [health, dmg, armor] = input
    .lines()
    .filter(Boolean)
    .map((line) => +line.split(': ')[1]);
  const Boss = { health, dmg, armor };
  return new RustIterator(Object.values(Shop.Weapons))
    .flatMap((weapon) =>
      new RustIterator(Object.values(Shop.Armor))
        .chain([[0, 0, 0]])
        .map((armor) => [weapon, armor]),
    )
    .flatMap(([weapon, armor]) =>
      new RustIterator(Object.values(Shop.Rings))
        .chain([[0, 0, 0]])
        .map((ring) => [weapon, armor, ring]),
    )
    .flatMap(([weapon, armor, ring1]) =>
      new RustIterator(Object.values(Shop.Rings))
        .chain([[0, 0, 0]])
        .filter((ring) => ring !== ring1)
        .map((ring) => [weapon, armor, ring1, ring]),
    )
    .map((items) => ({
      cost: items.map((item) => item[0]).reduce((a, b) => a + b),
      dmg: items.map((item) => item[1]).reduce((a, b) => a + b),
      armor: items.map((item) => item[2]).reduce((a, b) => a + b),
    }))
    .filter(({ dmg }) => dmg > Boss.armor + 1)
    .filter(({ armor }) => armor !== Boss.dmg)
    .filter(
      ({ dmg, armor }) =>
        Math.ceil(Boss.health / Math.max(dmg - Boss.armor, 1)) <=
        Math.ceil(100 / Math.max(Boss.dmg - armor, 1)),
    )
    .sort((a, b) => a.cost - b.cost)
    .nth(0).cost;
};
export const partTwo = (input: AOCInput) => {
  const [health, dmg, armor] = input
    .lines()
    .filter(Boolean)
    .map((line) => +line.split(': ')[1]);
  const Boss = { health, dmg, armor };
  return new RustIterator(Object.values(Shop.Weapons))
    .flatMap((weapon) =>
      new RustIterator(Object.values(Shop.Armor))
        .chain([[0, 0, 0]])
        .map((armor) => [weapon, armor]),
    )
    .flatMap(([weapon, armor]) =>
      new RustIterator(Object.values(Shop.Rings))
        .chain([[0, 0, 0]])
        .map((ring) => [weapon, armor, ring]),
    )
    .flatMap(([weapon, armor, ring1]) =>
      new RustIterator(Object.values(Shop.Rings))
        .chain([[0, 0, 0]])
        .filter((ring) => ring !== ring1)
        .map((ring) => [weapon, armor, ring1, ring]),
    )
    .map((items) => ({
      cost: items.map((item) => item[0]).reduce((a, b) => a + b),
      dmg: items.map((item) => item[1]).reduce((a, b) => a + b),
      armor: items.map((item) => item[2]).reduce((a, b) => a + b),
    }))
    .filter(
      ({ dmg, armor }) =>
        Math.ceil(Boss.health / Math.max(dmg - Boss.armor, 1)) >
        Math.ceil(100 / Math.max(Boss.dmg - armor, 1)),
    )
    .sort((a, b) => b.cost - a.cost)
    .nth(0).cost;
};
