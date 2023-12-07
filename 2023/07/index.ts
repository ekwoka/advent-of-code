import { AOCInput } from '../../utils';
/**
 * --- Day 7: Camel Cards ---
 */

export const partOne = (input: AOCInput): number => processInputs(input);

export const partTwo = (input: AOCInput): number => processInputs(input, true);

const ifPartTwo = <T>(fn: T, partTwo: boolean, fallback: T) =>
  partTwo ? fn : fallback;

const processInputs = (input: AOCInput, partTwo = false): number => {
  return input
    .lines()
    .map(
      (line) =>
        line
          .words()
          .enumerate()
          .flatMap(([idx, hand]) =>
            idx ? Number(hand) : [hand, handToType(hand, partTwo)],
          )
          .collect() as [AOCInput, HandTypes, number],
    )
    .sort(
      ([a, atype], [b, btype]) =>
        atype - btype || compareHighCard(a, b, partTwo),
    )
    .map(([_, __, bid]) => bid)
    .enumerate()
    .map(([spot, bid]) => (spot + 1) * bid)
    .sum();
};

enum HandTypes {
  HighCard,
  Pair,
  TwoPair,
  ThreeOfAKind,
  FullHouse,
  FourOfAKind,
  FiveOfAKind,
}

const handToType = (hand: AOCInput, partTwo = false) => {
  const [bestCount = [-1, ''], secondCount = [-1, '']] = hand
    .chars()
    .filter(
      ifPartTwo(
        (ch) => ch !== 'J',
        partTwo,
        () => true,
      ),
    )
    .fold(
      (acc, ch) => (
        (acc[acc.findIndex((cards) => !cards.includes(ch))] += ch), acc
      ),
      Array<string>(5).fill(''),
    )
    .toIter()
    .enumerate()
    .reverse()
    .filter(([_, cards]) => cards.length > 0)
    .collect();
  if (partTwo && hand.includes('J'))
    bestCount[0] += hand
      .chars()
      .filter((ch) => ch === 'J')
      .count();
  switch (bestCount[0]) {
    case 0:
      return HandTypes.HighCard;
    case 1:
      return bestCount[1].length === 2 ? HandTypes.TwoPair : HandTypes.Pair;
    case 2:
      return secondCount[0] === 1 - Number(partTwo && hand.includes('J')) &&
        secondCount[1].length === 2
        ? HandTypes.FullHouse
        : HandTypes.ThreeOfAKind;
    case 3:
      return HandTypes.FourOfAKind;
    case 4:
      return HandTypes.FiveOfAKind;
    default:
      throw new Error(`invalid hand: ${hand} ${bestCount} ${partOneCards}`);
  }
};

const partOneCards = '23456789TJQKA';
const part2Cards = 'J23456789TQKA';

const compareHighCard = (hand1: AOCInput, hand2: AOCInput, partTwo = false) => {
  const cardsToCheck = partTwo ? part2Cards : partOneCards;
  const comparison = hand1
    .chars()
    .zip(hand2.chars())
    .filter(([a, b]) => a !== b)
    .map(([a, b]) =>
      Math.sign(cardsToCheck.indexOf(a) - cardsToCheck.indexOf(b)),
    )
    .nth(0);
  return comparison ?? 0;
};
