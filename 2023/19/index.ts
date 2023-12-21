import { RustIterator } from '@ekwoka/rust-ts';
import { AOCInput } from '../../utils';

/**
 * --- Day 19: ??? ---
 */

const workflowRegex = /^(?<name>\w+){(?<checks>[^}]+)}$/;
const kvRegex = /(?<key>\w+)=(?<value>\d+)/g;
const Accept = Symbol('Accept');
const Reject = Symbol('Reject');
export const partOne = (input: AOCInput): number => {
  const lines = input.lines();
  const actions = lines.takeWhile((line) => line.toString() !== '').collect();
  const parts = lines.collect();
  const workflows = actions
    .toIter()

    .map((line) => line.match(workflowRegex))
    .filter(Boolean)

    .map(
      ({ groups: { name, checks } }) =>
        [
          name,
          new Function(
            'part',
            'scope',
            `with (part) { with (scope) { return ${checks
              .replaceAll(':', '?')
              .replaceAll(',', ':')} }}`,
          ) as Workflow,
        ] as const,
    )

    .fold((acc, [name, fn]) => ((acc[name] = fn), acc), {} as Scope);
  workflows.A = Accept;
  workflows.R = Reject;
  return parts
    .toIter()
    .map((line) =>
      new RustIterator(line.matchAll(kvRegex)).fold<Part>(
        (acc, { groups: { key, value } }) => ((acc[key] = Number(value)), acc),
        {},
      ),
    )
    .map((part) => {
      // eslint-disable-next-line @typescript-eslint/ban-types
      let nextProcess: Function | symbol = workflows.in;
      while (typeof nextProcess !== 'symbol') {
        nextProcess = nextProcess(part, workflows);
      }
      return [part, nextProcess] as const;
    })
    .filter(([_, x]) => x === Accept)
    .map(([part]) => Object.values(part).toIter().sum())
    .sum();
};
const checksRegex =
  /(?:(?:^(?<name>\w+){)|(?:(?<key>\w+)(?<op>[<>])(?<value>\d+):(?<do>\w+),))|(?:(?<else>\w+)}$)/g;
export const partTwo = (input: AOCInput): number => {
  const getChecks = RegexIterator(checksRegex);
  const workflows = input
    .lines()
    .takeWhile((line) => line.toString() !== '')
    .map((workflow) =>
      getChecks(workflow).fold(
        (
          acc,
          { groups: { name, key, op, value, do: thenDo, else: elseDo } },
        ) => {
          if (name) {
            acc.name ||= name;
          }
          if (key) {
            acc.checks.push({ key, op, value: Number(value), do: thenDo });
          }
          if (elseDo) {
            acc.else ||= elseDo;
          }
          return acc;
        },
        { name: '', checks: [], else: '' } as Part2Process,
      ),
    )
    .filter(Boolean)
    .fold(
      (acc, process) => ((acc[process.name] = process), acc),
      {} as Record<string, Part2Process>,
    );
  const getCombinations = (part: PartRange, process: string): bigint => {
    console.log(process, part);
    if (process === 'A') {
      const put = Object.values(part)
        .toIter()
        .map(([min, max]) => BigInt(Math.max(0, max - min)))
        .reduce((a, b) => a * b, 1n);
      console.log(put);
      return put;
    }
    if (process === 'R' || process === undefined) return 0n;
    const { checks, else: elseDo } = workflows[process];
    let count = 0n;
    for (const check of checks) {
      if (isInvalid(part[check.key])) continue;
      const [t, f] = splitCombos(part, check);
      part = f;
      if (isInvalid(t[check.key])) continue;
      console.log('passing', check, t, f);
      count = count + getCombinations(t, check.do);
    }
    console.log('handling else', elseDo);
    count += count + getCombinations(part, elseDo);
    console.log('counting combos later', count);
    return count;
  };
  return getCombinations(
    {
      x: [0, 4000],
      m: [0, 4000],
      a: [0, 4000],
      s: [0, 4000],
    },
    'in',
  );
};

const splitCombos = (part: PartRange, check: Check): [PartRange, PartRange] => {
  const { key, op, value } = check;
  const [min, max] = part[key];
  if (op === '<')
    return [
      { ...part, [key]: [min, value - 1] },
      { ...part, [key]: [value, max] },
    ];
  if (op === '>')
    return [
      { ...part, [key]: [value + 1, max] },
      { ...part, [key]: [min, value] },
    ];
};

type Part2Process = {
  name: string;
  checks: Check[];
  else: string;
};
type Check = {
  key: string;
  op: '<' | '>' | '=' | string;
  value: number;
  do: string;
};

type Workflow = (part: Part, scope: Scope) => Workflow | symbol;

type Scope = Record<string, Workflow | symbol>;

type Part = {
  x: number;
  m: number;
  a: number;
  s: number;
};
type PartRange = {
  x: [number, number];
  m: [number, number];
  a: [number, number];
  s: [number, number];
};

const RegexIterator = (regex: RegExp) => (str: string | AOCInput) =>
  new RustIterator(str.matchAll(regex));

const isInvalid = ([a, b]: [number, number]) => b < a;
