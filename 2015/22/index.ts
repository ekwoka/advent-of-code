import type { AOCInput } from '../../utils';

class Player {
  constructor(
    public health = 50,
    public mana = 500,
    public armor = 0,
    public effects = new Set<Effect>(),
    public spentMana = 0,
    public spellsCast: string[] = [],
  ) {}
  clone() {
    return new Player(
      this.health,
      this.mana,
      this.armor,
      new Set(Array.from(this.effects).map((effect) => effect.clone())),
      this.spentMana,
      [...this.spellsCast],
    );
  }
  toString() {
    return `${this.health}-${this.mana}-${this.spentMana}-${Array.from(this.effects).reduce((a, effect) => a | effect.valueOf(), 0)}`;
  }
}

class Boss {
  constructor(
    public health: number,
    public damage: number,
    public effects = new Set<Effect>(),
  ) {}
  act(player: Player) {
    player.health -= Math.max(1, this.damage - player.armor);
  }
  clone() {
    return new Boss(
      this.health,
      this.damage,
      new Set(Array.from(this.effects).map((effect) => effect.clone())),
    );
  }
  toString() {
    return `${this.health}-${Array.from(this.effects).reduce((a, effect) => a | effect.valueOf(), 0)}`;
  }
}

interface Effect {
  tick(player: Player, boss: Boss, effects: Set<Effect>): void;
  clone(): Effect;
  valueOf(): number;
}

class Poisoned implements Effect {
  constructor(public timer = 6) {}
  tick(_player: Player, boss: Boss, effects: Set<Effect>) {
    boss.health -= 3;
    if (--this.timer === 0) effects.delete(this);
  }
  clone() {
    return new Poisoned(this.timer);
  }
  valueOf() {
    return 1 << 0;
  }
}

class Shielded implements Effect {
  constructor(public timer = 6) {}
  tick(player: Player, _boss: Boss, effects: Set<Effect>) {
    if (--this.timer === 0) {
      player.armor -= 7;
      effects.delete(this);
    }
  }
  clone() {
    return new Shielded(this.timer);
  }
  valueOf() {
    return 1 << 1;
  }
}

class Charging implements Effect {
  constructor(public timer = 5) {}
  tick(player: Player, _boss: Boss, effects: Set<Effect>) {
    player.mana += 101;
    if (--this.timer === 0) effects.delete(this);
  }
  clone() {
    return new Charging(this.timer);
  }
  valueOf() {
    return 1 << 2;
  }
}

class Spell {
  constructor(
    public name: string,
    public spell: (player: Player, boss: Boss) => void,
    public cost: number,
  ) {}
  cast(player: Player, boss: Boss) {
    player.mana -= this.cost;
    player.spentMana += this.cost;
    this.spell(player, boss);
    player.spellsCast.push(this.name);
  }
}

const MagicMissile = new Spell(
  'magic missile',
  (_player, boss) => {
    boss.health -= 4;
  },
  53,
);

const Drain = new Spell(
  'drain',
  (player, boss) => {
    player.health += 2;
    boss.health -= 2;
  },
  73,
);

const Shield = new Spell(
  'shield',
  (player) => {
    if (Array.from(player.effects).some((effect) => effect instanceof Shielded))
      player.health -= Infinity;
    player.armor += 7;
    player.effects.add(new Shielded());
  },
  113,
);

const Poison = new Spell(
  'poison',
  (player, boss) => {
    if (Array.from(boss.effects).some((effect) => effect instanceof Poisoned))
      player.health -= Infinity;
    boss.effects.add(new Poisoned());
  },
  173,
);

const Recharge = new Spell(
  'recharge',
  (player) => {
    if (Array.from(player.effects).some((effect) => effect instanceof Charging))
      player.health -= Infinity;
    player.effects.add(new Charging());
  },
  229,
);

/**
 * Magic Missile costs 53 mana. It instantly does 4 damage.
 * Drain costs 73 mana. It instantly does 2 damage and heals you for 2 hit points.
 * Shield costs 113 mana. It starts an effect that lasts for 6 turns. While it is active, your armor is increased by 7.
 * Poison costs 173 mana. It starts an effect that lasts for 6 turns. At the start of each turn while it is active, it deals the boss 3 damage.
 * Recharge costs 229 mana. It starts an effect that lasts for 5 turns. At the start of each turn while it is active, it gives you 101 new mana.
 */
const Spells = [MagicMissile, Drain, Shield, Poison, Recharge];
export const partOne = (input: AOCInput, health = 50, mana = 500) => {
  const player = new Player(health, mana);
  const boss = new Boss(
    ...([...input.matchAll(/\d+/g)].map(([match]) => Number(match)) as [
      number,
      number,
    ]),
  );
  const queue: [player: Player, boss: Boss, nextSpell: Spell][] = Spells.filter(
    (spell) => spell.cost <= player.mana,
  ).map((spell) => [player.clone(), boss.clone(), spell]);
  const score = (player: Player, boss: Boss, nextSpell: Spell) =>
    boss.health + player.spentMana + nextSpell.cost - player.health;
  const visitedStates = new Set<string>();
  const addToQueue = (player: Player, boss: Boss, nextSpell: Spell) => {
    const key = `${player.toString()}-${boss.toString()}-${nextSpell.name}`;
    if (visitedStates.has(key)) return;
    else visitedStates.add(key);
    const insertPoint = queue.findIndex(
      (action) =>
        score(action[0], action[1], action[2]) > score(player, boss, nextSpell),
    );
    if (insertPoint >= 0)
      queue.splice(insertPoint, 0, [player.clone(), boss.clone(), nextSpell]);
    else queue.push([player.clone(), boss.clone(), nextSpell]);
  };
  while (queue.length) {
    const [player, boss, nextSpell] = queue.shift()!;
    nextSpell.cast(player, boss);
    if (player.health <= 0) continue;
    if (boss.health <= 0) return player.spentMana;
    player.effects.forEach((effect) =>
      effect.tick(player, boss, player.effects),
    );
    boss.effects.forEach((effect) => effect.tick(player, boss, boss.effects));
    if (boss.health <= 0) return player.spentMana;
    boss.act(player);
    if (player.health <= 0) continue;
    player.effects.forEach((effect) =>
      effect.tick(player, boss, player.effects),
    );
    boss.effects.forEach((effect) => effect.tick(player, boss, boss.effects));
    if (boss.health <= 0) return player.spentMana;
    Spells.filter((spell) => spell.cost <= player.mana).forEach((spell) =>
      addToQueue(player, boss, spell),
    );
  }
};
export const partTwo = (input: AOCInput, health = 50, mana = 500) => {
  const player = new Player(health, mana);
  const boss = new Boss(
    ...([...input.matchAll(/\d+/g)].map(([match]) => Number(match)) as [
      number,
      number,
    ]),
  );
  const queue: [player: Player, boss: Boss, nextSpell: Spell][] = Spells.filter(
    (spell) => spell.cost <= player.mana,
  ).map((spell) => [player.clone(), boss.clone(), spell]);
  const score = (player: Player, boss: Boss, nextSpell: Spell) =>
    boss.health + player.spentMana + nextSpell.cost - player.health;
  const visitedStates = new Set<string>();
  const addToQueue = (player: Player, boss: Boss, nextSpell: Spell) => {
    const key = `${player.toString()}-${boss.toString()}-${nextSpell.name}`;
    if (visitedStates.has(key)) return;
    else visitedStates.add(key);
    const insertPoint = queue.findIndex(
      (action) =>
        score(action[0], action[1], action[2]) > score(player, boss, nextSpell),
    );
    if (insertPoint >= 0)
      queue.splice(insertPoint, 0, [player.clone(), boss.clone(), nextSpell]);
    else queue.push([player.clone(), boss.clone(), nextSpell]);
  };
  while (queue.length) {
    const [player, boss, nextSpell] = queue.shift()!;
    nextSpell.cast(player, boss);
    if (player.health <= 0) continue;
    if (boss.health <= 0) return player.spentMana;
    player.effects.forEach((effect) =>
      effect.tick(player, boss, player.effects),
    );
    boss.effects.forEach((effect) => effect.tick(player, boss, boss.effects));
    if (boss.health <= 0) return player.spentMana;
    boss.act(player);
    player.health -= 1;
    if (player.health <= 0) continue;
    player.effects.forEach((effect) =>
      effect.tick(player, boss, player.effects),
    );
    boss.effects.forEach((effect) => effect.tick(player, boss, boss.effects));
    if (boss.health <= 0) return player.spentMana;
    Spells.filter((spell) => spell.cost <= player.mana).forEach((spell) =>
      addToQueue(player, boss, spell),
    );
  }
};
