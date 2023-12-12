/* eslint-disable @typescript-eslint/no-unused-vars */
import { Err, Ok, Result, RustIterator } from '@ekwoka/rust-ts';
import { mkdir } from 'node:fs/promises';

await mkdir(new URL('./.cache', import.meta.url), { recursive: true });

export const getInput = async (year: Year, day: Day) => {
  const input = await getFromCache(year, day);
  return new AOCInput(input);
};

export const submitAnswer = async (
  year: Year,
  day: Day,
  part: 1 | 2,
  answer: string,
): Promise<Result<never, Error>> => {
  const cached = (await checkAnswerCache(year, day, part)).find(
    (solution) => solution === answer,
  );
  if (cached)
    return new Err(new Error('This answer has already been attempted'));
  const result = await postAnswer(year, day, part, answer);
  return new Ok();
};

const checkAnswerCache = async (year: Year, day: Day, part: 1 | 2) => {
  const cachedAnswers = Bun.file(
    new URL(`./.cache/${year}-${day}.answers.txt`, import.meta.url),
  );
  if (!(await cachedAnswers.exists())) {
    await Bun.write(cachedAnswers, JSON.stringify({ [1]: [], [2]: [] }));
  }

  const data = await cachedAnswers.json<SolutionCache>();
  return data[part];
};

type SolutionCache = {
  [part in 1 | 2]: string[];
};

const postAnswer = (
  year: Year,
  day: Day,
  part: 1 | 2,
  answer: string,
): Result<never, Error> => {
  const url = `https://adventofcode.com/${year}/day/${day}/answer`;
  const data = new FormData();
  data.append('level', part.toString());
  data.append('answer', answer);
  console.log('posting answer to:', url);
  return new Ok();
};

const INCORRECT_ANSWER = ["That's not the right answer"];
const CORRECT_ANSWER = ["That's the right answer"];
const TOO_HIGH = ["That's too high"];
const TOO_LOW = ["That's too low"];
const TOO_FAST = ["You're trying too fast"];

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
        'User-Agent': 'github.com/ekwoka/advent-of-code',
        cookie: `session=${session}`,
      },
    },
  );
  if (!response.ok)
    throw new Error(`Failed to fetch input for day ${day} of year ${year}`);
  return response as Response;
};

export const getFromCache = async (year: Year, day: Day): Promise<string> => {
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
