import '@ekwoka/rust-ts/prelude';
import type { AOCInput } from '../../utils';

class Bot extends EventTarget {
  chips: number[] = [];
  constructor(
    public id: number,
    public lowTarget: [type: string, id: number],
    public highTarget: [type: string, id: number],
  ) {
    super();
  }
  give(value: number) {
    this.chips.push(value);
    return this;
  }
  run(bots: Map<number, Bot>, outputs: number[]) {
    if (this.chips.length < 2) return true;
    this.chips.sort((a, b) => a - b);
    const event = new CustomEvent('compare', {
      detail: { id: this.id, chips: this.chips },
    });
    this.dispatchEvent(event);
    if (event.defaultPrevented) return false;
    const [low, high] = this.chips;
    this.chips = [];
    if (this.lowTarget[0] === 'bot')
      bots.get(this.lowTarget[1])?.give(low).run(bots, outputs);
    else outputs[this.lowTarget[1]] = low;
    if (this.highTarget[0] === 'bot')
      bots.get(this.highTarget[1])?.give(high).run(bots, outputs);
    else outputs[this.highTarget[1]] = high;
  }
}

export const partOne = (
  input: AOCInput,
  value1: number,
  value2: number,
): number => {
  const bots = new Map<number, Bot>();
  const inputs: [target: number, chip: number][] = [];
  let compareBot = -1;
  const outputs: number[] = [];
  input.lines().forEach((line) => {
    if (line.startsWith('value')) {
      const [chip, target] = line.match(/\d+/g)!.map(Number);
      inputs.push([target, chip]);
    } else {
      const [id, low, high] = line
        .match(/(?:(?:bot|output) )?\d+/g)!
        .map((match) => match.split(' '))
        .map(([type, id]) => [type, Number(id)] as [string, number]);
      const bot = new Bot(Number(id[1]), low, high);
      bot.addEventListener('compare', (event) => {
        if (event instanceof CustomEvent) {
          const { id, chips } = event.detail;
          if (chips[0] === value1 && chips[1] === value2) {
            compareBot = id;
            event.preventDefault();
          }
        }
      });
      bots.set(bot.id, bot);
    }
  });
  for (const [target, chip] of inputs) {
    bots.get(target)?.give(chip).run(bots, outputs);
    if (compareBot !== -1) break;
  }
  return compareBot;
};
export const partTwo = (input: AOCInput): number => {
  const bots = new Map<number, Bot>();
  const inputs: [target: number, chip: number][] = [];
  const outputs: number[] = [];
  input
    .lines()
    .filter(Boolean)
    .forEach((line) => {
      if (line.startsWith('value')) {
        const [chip, target] = line.match(/\d+/g)!.map(Number);
        inputs.push([target, chip]);
      } else {
        const [id, low, high] = line
          .match(/(?:(?:bot|output) )?\d+/g)!
          .map((match) => match.split(' '))
          .map(([type, id]) => [type, Number(id)] as [string, number]);
        const bot = new Bot(Number(id[1]), low, high);
        bots.set(bot.id, bot);
      }
    });
  for (const [target, chip] of inputs) {
    bots.get(target)?.give(chip).run(bots, outputs);
  }
  return outputs.slice(0, 3).reduce((acc, val) => acc * val, 1);
};
