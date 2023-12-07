import { RustIterator } from '@ekwoka/rust-ts';
import { mkdir } from 'node:fs/promises';
export const getInput = async (year: Year, day: Day) => {
  const input = await getFromCache(year, day);
  return new AOCInput(input);
};

Set.prototype.toIter =
  Array.prototype.toIter =
  Map.prototype.toIter =
    function () {
      return new RustIterator(this);
    };

declare global {
  interface Set<T> {
    toIter(): RustIterator<T>;
  }
  interface Array<T> {
    toIter(): RustIterator<T>;
  }
  interface Map<K, V> {
    toIter(): RustIterator<[K, V]>;
  }
}

export const fetchInput = async (year: Year, day: Day): Promise<Response> => {
  const session = process.env.AOC_SESSION;
  if (!session) throw new Error('No session cookie provided in .env file');
  const response = await fetch(
    `https://adventofcode.com/${year}/day/${day}/input`,
    {
      headers: {
        cookie: `session=${session}`,
      },
    },
  );
  if (!response.ok)
    throw new Error(`Failed to fetch input for day ${day} of year ${year}`);
  return response as Response;
};

export const getFromCache = async (year: Year, day: Day): Promise<string> => {
  await mkdir(new URL('./.cache', import.meta.url), { recursive: true });
  const cacheFile = Bun.file(
    new URL(`./.cache/${year}-${day}.txt`, import.meta.url),
  );
  if (!(await cacheFile.exists())) {
    const input = await fetchInput(year, day);
    await Bun.write(cacheFile, input);
  }
  return cacheFile.text();
};

export class AOCInput extends String {
  constructor(value: string) {
    super(value);
  }
  chars() {
    return new RustIterator(chars(this));
  }
  words() {
    return new RustIterator(splitBy(this, ' '));
  }
  lines() {
    return new RustIterator(splitBy(this, '\n'));
  }
  splitBy(separator: string) {
    return new RustIterator(splitBy(this, separator));
  }
}
// eslint-disable-next-line @typescript-eslint/ban-types
type AllStrings = string | String;
const chars = function* (str: AllStrings) {
  yield* str;
};
const splitBy = function* (str: AllStrings, separator: string) {
  let buffer = '';
  for (const char of str) {
    if (char === separator) {
      yield new AOCInput(buffer);
      buffer = '';
    } else buffer += char;
  }
  if (buffer.length > 0) yield new AOCInput(buffer);
};

type Year = 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023;

type Day =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25;

declare global {
  interface ProcessEnv {
    AOC_SESSION: string;
  }
}
