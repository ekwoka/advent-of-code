import '../../utils/prelude';
import type { AOCInput } from '../../utils';

export const partOne = (input: AOCInput) => {
  return input
    .lines()
    .filter(Boolean)
    .flatMap((line) => line.matchAll(/-?\d+/g))
    .map((match) => match[0])
    .map(Number)
    .sum();
};

const hasRedValue = (object: Record<string, unknown>) =>
  Object.values(object).includes('red');
function* iterateNonRedObjects(
  object: Array<unknown> | Record<string, unknown> | string | number,
) {
  if (Array.isArray(object)) yield* object.iter().flatMap(iterateNonRedObjects);
  else if (typeof object === 'string') yield object;
  else if (typeof object === 'number') yield object;
  else if (!hasRedValue(object))
    yield* Object.values(object).iter().flatMap(iterateNonRedObjects);
}

export const partTwo = (input: AOCInput) => {
  const data = JSON.parse(input.toString());
  if (hasRedValue(data)) return 0;
  return iterateNonRedObjects(data).iter().map(Number).filter(Boolean).sum();
};
