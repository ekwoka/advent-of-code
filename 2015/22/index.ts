import { RustIterator } from '@ekwoka/rust-ts';
import type { AOCInput } from '../../utils';
/**
 * As this problem, similar to the previous, is meant to emulate game decisions
 * but with much more complicated action choices,
 * I decided to go with a more "game dev" style Entity-Component-System (ECS)
 * This is not because it's inherently more efficient or optimized
 * but because it's a common structure for handling this kind of simulation
 * and because it's kind of fun
 */

Set.prototype.innerValues = Set.prototype.values;
Set.prototype.values = function () {
  return new RustIterator(this.innerValues());
};
Set.prototype.clone = function (this: Set<Entity>) {
  return new Set(this.values().map((entity) => entity.clone()));
};

interface Entity {
  clone(): Entity;
}

interface Character extends Entity {
  health: number;
  clone(): Character;
  toString(): string;
}

class Player implements Character {
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
      this.effects.clone(),
      this.spentMana,
      structuredClone(this.spellsCast),
    );
  }
  toString() {
    return `${this.health}-${this.mana}-${this.spentMana}-${this.effects
      .values()
      .fold((a, effect) => a | effect.valueOf(), 0)}`;
  }
}

class Boss implements Character {
  constructor(
    public health: number,
    public damage: number,
    public effects = new Set<Effect>(),
  ) {}
  act(player: Player) {
    player.health -= Math.max(1, this.damage - player.armor);
  }
  clone() {
    return new Boss(this.health, this.damage, this.effects.clone());
  }
  toString() {
    return `${this.health}-${this.effects
      .values()
      .reduce((a, effect) => a | effect.valueOf(), 0)}`;
  }
}

interface Effect extends Entity {
  timer: number;
  tick(target: Character): void;
  clone(): Effect;
  valueOf(): number;
}

class Poisoned implements Effect {
  constructor(public timer = 6) {}
  tick(boss: Boss) {
    boss.health -= 3;
    if (--this.timer === 0) boss.effects.delete(this);
  }
  clone() {
    return new Poisoned(this.timer);
  }
  valueOf() {
    return ((1 << 3) | this.timer) << 0;
  }
}

class Shielded implements Effect {
  constructor(public timer = 6) {}
  tick(player: Player) {
    if (--this.timer === 0) {
      player.armor -= 7;
      player.effects.delete(this);
    }
  }
  clone() {
    return new Shielded(this.timer);
  }
  valueOf() {
    return ((1 << 3) | this.timer) << 4;
  }
}

class Charging implements Effect {
  constructor(public timer = 5) {}
  tick(player: Player) {
    player.mana += 101;
    if (--this.timer === 0) player.effects.delete(this);
  }
  clone() {
    return new Charging(this.timer);
  }
  valueOf() {
    return ((1 << 3) | this.timer) << 8;
  }
}

class Spell {
  constructor(
    public name: string,
    public spell: (state: GameState) => void,
    public cost: number,
  ) {}
  cast(state: GameState) {
    state.Player.mana -= this.cost;
    state.Player.spentMana += this.cost;
    this.spell(state);
    state.Player.spellsCast.push(this.name);
  }
}

const MagicMissile = new Spell(
  'magic missile',
  ({ Boss }) => {
    Boss.health -= 4;
  },
  53,
);

const Drain = new Spell(
  'drain',
  ({ Player, Boss }) => {
    Player.health += 2;
    Boss.health -= 2;
  },
  73,
);

const Shield = new Spell(
  'shield',
  ({ Player }) => {
    if (Array.from(Player.effects).some((effect) => effect instanceof Shielded))
      Player.health -= Infinity;
    Player.armor += 7;
    Player.effects.add(new Shielded());
  },
  113,
);

const Poison = new Spell(
  'poison',
  ({ Player, Boss }) => {
    if (Boss.effects.values().any((effect) => effect instanceof Poisoned))
      Player.health -= Infinity;
    Boss.effects.add(new Poisoned());
  },
  173,
);

const Recharge = new Spell(
  'recharge',
  ({ Player }) => {
    if (Player.effects.values().any((effect) => effect instanceof Charging))
      Player.health -= Infinity;
    Player.effects.add(new Charging());
  },
  229,
);

class GameState {
  constructor(
    public Player: Player,
    public Boss: Boss,
  ) {}
  tick() {
    this.Player.effects.forEach((effect) => effect.tick(this.Player));
    this.Boss.effects.forEach((effect) => effect.tick(this.Boss));
  }
  clone() {
    return new GameState(this.Player.clone(), this.Boss.clone());
  }
  toString() {
    return `${this.Player.toString()}-${this.Boss.toString()}`;
  }
  get done() {
    return Boolean(this.winner);
  }
  get winner() {
    if (this.Player.health <= 0) return this.Boss;
    if (this.Boss.health <= 0) return this.Player;
    return null;
  }
  log() {
    console.table({
      done: Boolean(this.winner),
      mana: this.Player.spentMana,
      Player: this.Player.toString(),
      Boss: this.Boss.toString(),
      spells: this.Player.spellsCast.length,
      spellsList: this.Player.spellsCast.join(', '),
    });
  }
}
const Spells = [MagicMissile, Drain, Shield, Poison, Recharge];
export const partOne = (
  input: AOCInput,
  health = 50,
  mana = 500,
  hardMode = false,
) => {
  const startingState = new GameState(
    new Player(health, mana),
    new Boss(
      ...([...input.matchAll(/\d+/g)].map(([match]) => Number(match)) as [
        number,
        number,
      ]),
    ),
  );
  const queue: [state: GameState, nextSpell: Spell][] = Spells.filter(
    (spell) => spell.cost <= startingState.Player.mana,
  ).map((spell) => [startingState.clone(), spell]);
  const score = ({ Player, Boss }, nextSpell: Spell) =>
    Boss.health + Player.spentMana + nextSpell.cost - Player.health;
  const visitedStates = new Set<string>();
  const addToQueue = (state: GameState, nextSpell: Spell) => {
    const key = `${state.toString()}-${nextSpell.name}`;
    if (visitedStates.has(key)) return;
    else visitedStates.add(key);
    const insertPoint = queue.findIndex(
      (action) => score(action[0], action[1]) > score(state, nextSpell),
    );
    if (insertPoint >= 0)
      queue.splice(insertPoint, 0, [state.clone(), nextSpell]);
    else queue.push([state.clone(), nextSpell]);
  };
  while (queue.length) {
    const [state, nextSpell] = queue.shift()!;
    if (hardMode) state.Player.health -= 1;
    nextSpell.cast(state);
    if (state.done)
      if (state.winner instanceof Boss) continue;
      else return state.Player.spentMana;
    state.tick();
    if (state.done && state.winner instanceof Player)
      return state.Player.spentMana;
    state.Boss.act(state.Player);
    if (state.done && state.winner instanceof Boss) continue;
    state.tick();
    if (state.done && state.winner instanceof Player)
      return state.Player.spentMana;
    Spells.filter((spell) => spell.cost <= state.Player.mana).forEach((spell) =>
      addToQueue(state, spell),
    );
  }
};
