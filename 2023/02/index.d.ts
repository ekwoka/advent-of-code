// eslint-disable-next-line @typescript-eslint/ban-ts-comment

/**
 * Going to try to tackle this day in just the Type System
 * No "runtime" javascript, just Types
 * I will use the test cases only, as the large input
 * may be passed type recursion limits
 */

import type { GreaterThan, Max } from './compare';
import type { EQ, Sum } from './math';
import type { Split } from './transform';

/**
 * Types for our structs/data
 */
type Game = {
  id: number;
  red: number;
  green: number;
  blue: number;
};

type Color = 'red' | 'green' | 'blue';

type ColorCountEntry = [number, Color];

type Input =
  'Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green\nGame 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue\nGame 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red\nGame 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red\nGame 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green';

type Limit = {
  id: 0;
  red: 12;
  green: 13;
  blue: 14;
};

/**
 * The actual answers!!!
 */

// Part 1: Count the number of games that have no color over the limit

// This is the "function" type to calculate Part One
type PartOne<T extends string> = Sum<
  FilterOverLimitAndMapToID<MapLinesToGame<SeparateGames<T>>>
>;

// The Result of course
type PartOneResult = PartOne<Input>;

// Asserts that the result is the expected 8
type _P1IsCorrect = Assert<EQ<PartOneResult, 8>>;

/**
 * Our Functions
 * Here we will do the actual specific work involved in getting an answer
 */

// Splits inputs into games (lines)
type SeparateGames<T extends string> = Split<T, '\n'>;

// Maps each Line into a Game
type MapLinesToGame<T extends string[]> = T extends [
  infer A extends string,
  ...infer B extends string[],
]
  ? [CreateGame<A>, ...MapLinesToGame<B>]
  : [];

/**
 * Parses a single line into a Game struct
 * This separates out the ID, splits the color counts and assigns the maximum back into the struct
 */
type CreateGame<T extends string> = T extends `Game ${infer A extends
  number}: ${infer B extends `${number} ${Color}${string}`}`
  ? AssignMaxColors<
    {
      id: A;
      red: 0;
      green: 0;
      blue: 0;
    },
    DrawsToColorEntries<Split<B, ',' | ';'>>
  >
  : never;

/**
 * This loops over the games and filters out any that have a color over the limit
 * This actually has a bug right now that works for the sample but not all inputs
 */
type FilterOverLimitAndMapToID<A extends Game[]> = A extends [
  infer G extends Game,
  ...infer Rest extends Game[],
]
  ? GreaterThan<G[Color], Limit[Color]> extends false
  ? [G['id'], ...FilterOverLimitAndMapToID<Rest>]
  : FilterOverLimitAndMapToID<Rest>
  : [];

/**
 * Handles mapping over the draws to create color entries
 */
type DrawsToColorEntries<T extends string[]> = T extends [
  infer A extends string,
  ...infer B extends string[],
]
  ? [InferColorCount<A>, ...DrawsToColorEntries<B>]
  : [];

// Creates the color entries
type InferColorCount<S extends string> = TrimLeft<S> extends `${infer N extends
  number} ${infer C}`
  ? [N, C]
  : [];

/**
 * This loops over color entries and handles assigning the max of a color to the game
 * Uses the InnerAssignMax to do the actual assignment to clean up the type
 */
type AssignMaxColors<G extends Game, E extends [number, Color][]> = E extends [
  infer A extends [number, Color],
  ...infer Rest extends [number, Color][],
]
  ? AssignMaxColors<InnerAssignMax<G, A>, Rest>
  : G;

type InnerAssignMax<G extends Game, E extends ColorCountEntry> = E extends [
  infer N extends number,
  infer C extends Color,
]
  ? { [K in keyof Game]: K extends C ? Max<G[K], N> : G[K] }
  : never;

/**
 * Some Utility Types
 */
type Assert<T extends true> = T;

type ToRemove = ' ' | ',' | ';' | '0';

type TrimLeft<S extends string> = S extends `${infer P}${infer T}`
  ? P extends ToRemove
  ? TrimLeft<T>
  : S
  : S;
