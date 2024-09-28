/* eslint-disable @typescript-eslint/no-non-null-assertion */
/**
 * --- Day 19: Not Enough Minerals ---
 * Part 1: 01:26:24    749
 * Part 2: 02:13:09    885
 * More BFS branching! This one is not about exhausting all possibilities, but instead about finding conditions from which we can prune a branch before reaching the end
 */
import { readFile } from 'node:fs/promises';

// Input is a collection of blueprints for building robots. We need to find which blueprint contains the best values for getting the maximum number of geodes in x time.
const input: string = (await readFile('input.txt', 'utf8')).trim();

const robotTypes = ['ore', 'clay', 'obsidian', 'geode'] as const;

const blueprints = input.split('\n').map((line) => {
  const [label, costs] = line.split(':');
  const id = label.match(/\d+/)?.[0];
  const robotCosts = Object.fromEntries(
    costs
      .split('.')
      .filter(Boolean)
      .map((costString) => {
        const type = costString.match(/Each\s[a-z]+/)?.[0]?.split(' ')[1];
        const costs = Object.fromEntries(
          [...costString.matchAll(/\d+\s[a-z]+/g)].map((match) => {
            const [value, material] = match[0].split(' ');
            return [material, Number(value)];
          }),
        );
        return [type, costs];
      }),
  ) as {
    [key in (typeof robotTypes)[number]]: {
      [key in (typeof robotTypes)[number]]: number;
    };
  };
  return { id, robotCosts };
});

const getBestBlueprint = (totalTime: number, blueprintLimit?: number) => {
  const scores = blueprints.slice(0, blueprintLimit).map((blueprint) => {
    // There is no benefit to building more robots than the maximum number of each type of ore required to build a robot of that type (as the speed of robot manufacture is capped. ie: collecting 15 ore when you can only consume 10 ore per round is useless)
    const maximumOfEachRobot = Object.fromEntries(
      robotTypes.map((type) => {
        if (type === 'geode') return ['geode', Number.POSITIVE_INFINITY];
        const maxOfType = Math.max(
          ...Object.values(blueprint.robotCosts).map((cost) => cost[type] ?? 0),
        );
        return [type, maxOfType];
      }),
    ) as Record<(typeof robotTypes)[number], number>;
    // If all ore are over the maximum needed to build a robot, then we HAVE to build a robot.
    const allOreOverMaximum = (
      inventory: Record<(typeof robotTypes)[number], number>,
    ) =>
      Object.entries(inventory).every(
        ([type, count]) =>
          count >= maximumOfEachRobot[type] && type !== 'geode',
      );
    // Get the list of robots that can be built with the current inventory
    const getAffordableBot = (
      inventory: Record<(typeof robotTypes)[number], number>,
      currentBots: Record<(typeof robotTypes)[number], number>,
    ) =>
      Object.entries(blueprint.robotCosts).filter(
        ([type, cost]) =>
          currentBots[type] < maximumOfEachRobot[type] &&
          Object.entries(cost).every(
            ([material, value]) => inventory[material] >= value,
          ),
      ) as Array<
        [(typeof robotTypes)[number], typeof blueprint.robotCosts.ore]
      >;
    // Our queue we will work through containing all the state
    const bfsqueue: Parameters<typeof step>[] = [
      [
        { ore: 0, clay: 0, obsidian: 0, geode: 0 },
        { ore: 1, clay: 0, obsidian: 0, geode: 0 },
        [],
        totalTime,
      ],
    ];
    let maxThusFar = 0;
    const setMax = (val: number) => {
      maxThusFar = Math.max(maxThusFar, val);
    };
    const step = (
      inventory: Record<(typeof robotTypes)[number], number>,
      currentBots: Record<(typeof robotTypes)[number], number>,
      cantBuy: Array<(typeof robotTypes)[number]>,
      timeLeft: number,
    ): void => {
      // If we have no time left, we can't do anything
      if (timeLeft === 0) {
        setMax(inventory.geode);
        return;
      }
      // If we too few of certain robots late into the time, then it's impossible to have a good result, so we can cut that branch short
      if (
        currentBots.obsidian === 0 &&
        timeLeft <= ((blueprint.robotCosts.geode.obsidian / 3) | 0)
      )
        return;
      if (
        currentBots.clay === 0 &&
        timeLeft <=
          (((blueprint.robotCosts.geode.clay +
            blueprint.robotCosts.geode.obsidian) /
            2) |
            0)
      )
        return;
      // If a branch has already fallen too far behind, then we can cut it short
      if (inventory.geode + currentBots.geode * timeLeft * 2 < maxThusFar)
        return;
      // We filter the list of robots we can build at this turn to remove unaffordable robots and those robots that we could have built last turn. There is no benefit to waiting to build a bot if you can build it now so we can't build anything this turn we could have built last turn
      const affordableBots = getAffordableBot(inventory, currentBots).filter(
        ([type]) => !cantBuy.includes(type),
      );
      // let the robots harvest their materials
      Object.entries(currentBots).forEach(([type, count]) => {
        inventory[type] += count;
      });
      setMax(inventory.geode);

      // Don't build anything if there is still a chance we can save up for something
      if (!allOreOverMaximum(inventory))
        bfsqueue.push([
          { ...inventory },
          { ...currentBots },
          affordableBots.map(([type]) => type),
          timeLeft - 1,
        ]);
      // if there are robots we can build, build them
      if (affordableBots.length)
        bfsqueue.push(
          ...affordableBots.map(([type, cost]) => {
            const inventoryAfterBuild = Object.fromEntries(
              Object.entries(inventory).map(([oreType, oreCount]) => [
                oreType,
                oreCount - (cost[oreType] ?? 0),
              ]),
            ) as Record<(typeof robotTypes)[number], number>;
            return [
              inventoryAfterBuild,
              { ...currentBots, [type]: currentBots[type] + 1 },
              [],
              timeLeft - 1,
            ] as Parameters<typeof step>;
          }),
        );
    };
    while (bfsqueue.length) step(...bfsqueue.shift());

    const result = [blueprint.id, maxThusFar] as [string, number];
    return result;
  });
  return scores;
};

// Part 1 consists in processing the blueprints for 24 minutes, and summing up their quality score
wrapInTime('one', () =>
  console.log(
    'Part One:',
    getBestBlueprint(24).reduce(
      (acc, [id, geodes]) => acc + Number(id) * geodes,
      0,
    ),
  ),
);
// Part 2 involves processing just the first 3 blueprints for 32 minutes and multiplying the final geode counts from each blueprint
wrapInTime('two', () =>
  console.log(
    'Part Two:',
    getBestBlueprint(32, 3).reduce((acc, [_, geodes]) => acc * geodes, 1),
  ),
);

function wrapInTime(label: string, fn: () => void) {
  console.time(label);
  fn();
  console.timeEnd(label);
}
