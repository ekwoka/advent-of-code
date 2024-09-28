import { RustIterator } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';

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
        {} as Part,
      ),
    )
    .map((part) => {
      // eslint-disable-next-line @typescript-eslint/ban-types
      let nextProcess: Workflow | symbol = workflows.in;
      while (typeof nextProcess !== 'symbol')
        nextProcess = nextProcess(part, workflows);
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
  const getCombinations = (part: PartRange, process: string): PartRange[] => {
    if (process === 'A') return [part];
    if (process === 'R' || process === undefined) return [];
    const possibilities: PartRange[] = [];
    const { checks, else: elseDo } = workflows[process];
    for (const check of checks) {
      if (isInvalid(part[check.key])) continue;
      const [t, f] = splitCombos(part, check);
      part = f;
      if (isInvalid(t[check.key])) continue;
      possibilities.push(...getCombinations(t, check.do));
    }
    possibilities.push(...getCombinations(part, elseDo));
    return possibilities;
  };
  const combos = getCombinations(
    {
      x: [1, 4000],
      m: [1, 4000],
      a: [1, 4000],
      s: [1, 4000],
    },
    'in',
  );
  return calculateCombos(combos);
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

const calculateCombos = (parts: PartRange[]): number => {
  const combos = parts
    .map((part) =>
      Object.values(part)
        .toIter()
        .map(([min, max]) => max - min + 1)
        .reduce((a, b) => a * b, 1),
    )
    .toIter()
    .sum();
  return combos;
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
