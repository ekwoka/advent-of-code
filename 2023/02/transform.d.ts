export type MapToNumbers<T extends string[]> = T extends [
  infer A extends `${number}`,
  ...infer B extends string[],
]
  ? [ToNumber<A>, ...MapToNumbers<B>]
  : [];

export type MapToStrings<T extends number[]> = T extends [
  infer A extends number,
  ...infer B extends number[],
]
  ? [`${A}`, ...MapToStrings<B>]
  : [];

export type ToNumber<S extends string> = S extends `${infer N extends number}`
  ? N
  : never;

export type Split<
  S extends string,
  D extends string,
  Current extends string = '',
> = S extends ''
  ? Current extends ''
    ? []
    : [Current]
  : S extends `${infer T}${infer U}`
    ? T extends D
      ? Current extends ''
        ? Split<U, D>
        : [Current, ...Split<U, D>]
      : Split<U, D, `${Current}${T}`>
    : [Current];

export type SplitAll<S extends string> = S extends `${infer T}${infer U}`
  ? [T, ...SplitAll<U>]
  : [];

export type Join<T extends string[], D extends string = ''> = T extends [
  infer A extends string,
  ...infer B extends string[],
]
  ? B extends []
    ? A
    : `${A}${D}${Join<B, D>}`
  : '';

export type ExplodeNumber<T extends number> = MapToNumbers<SplitAll<`${T}`>>;
