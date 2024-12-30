import { existsSync } from 'node:fs';
import {
  appendFile,
  mkdir,
  readdir,
  readFile,
  writeFile,
} from 'node:fs/promises';
import { resolve } from 'node:path';
const args = process.argv.slice(2);

const problemArgs = args.filter((arg) => !arg.startsWith('-'));

let latestYear = new Date().getFullYear();
if (new Date().getMonth() <= 10) latestYear -= 1;
const year = problemArgs.find((arg) => arg.length === 4) ?? String(latestYear);
const nextDay = !existsSync(resolve(process.cwd(), year))
  ? 1
  : ((await readdir(resolve(process.cwd(), year)))
      .filter((name) => name.length === 2)
      .map(Number)
      .sort((a, b) => a - b)
      .at(-1) ?? 0) + 1;

const day = (
  problemArgs.find((arg) => arg.length <= 2) ?? nextDay.toString()
).padStart(2, '0');

if (day === '26') {
  console.error(`You've already completed every problem in ${year}`);
  process.exit(1);
}

const options = {
  typescript: false,
  rust: false,
};

for (const arg of args.filter((arg) => arg.startsWith('-'))) {
  console.log(arg);
  if (arg.startsWith('--')) {
    switch (arg) {
      case '--ts':
      case '--typescript':
        options.typescript = true;
        continue;
      case '--rust':
        options.rust = true;
        continue;
    }
    continue;
  }
  for (const a of arg.slice(1)) {
    switch (a) {
      case 'r':
        options.rust = true;
        continue;
      case 't':
        options.typescript = true;
        continue;
    }
  }
}

console.log(
  'Creating solution template for',
  year,
  'day',
  day,
  'in',
  Object.entries(options)
    .filter(([_, v]) => v)
    .map(([k]) => k)
    .join(' & '),
);

const yearPath = resolve(process.cwd(), year);
if (!existsSync(yearPath)) await mkdir(yearPath);

const dayPath = resolve(yearPath, day);
if (!existsSync(dayPath)) await mkdir(dayPath);

const testPath = resolve(dayPath, 'bun.test.ts');
const templatePath = resolve(import.meta.url.slice(7), '..', 'template');
if (!existsSync(testPath)) {
  const initialContent = (
    await readFile(resolve(templatePath, 'bun-test.ts'))
  ).toString();
  await writeFile(
    testPath,
    initialContent.replace('2015, 1', `${year}, ${Number(day)}`),
  );
}
const initialContent = (await readFile(testPath)).toString();
if (options.typescript) {
  if (!initialContent.includes('./index')) {
    const tsContent = (
      await readFile(resolve(templatePath, 'bun-ts-test.ts'))
    ).toString();
    await appendFile(
      testPath,
      tsContent.replace('2015 Day 1', `${year} Day ${Number(day)}`),
    );
  }
  if (!existsSync(resolve(dayPath, 'index.ts'))) {
    await writeFile(
      resolve(dayPath, 'index.ts'),
      await readFile(resolve(templatePath, 'index.ts')),
    );
  }
}

if (options.rust) {
  if (!initialContent.includes("('./main.rs')")) {
    const rsContent = (
      await readFile(resolve(templatePath, 'bun-rs-test.ts'))
    ).toString();
    await appendFile(
      testPath,
      rsContent.replace('2015 Day 1', `${year} Day ${Number(day)}`),
    );
  }
  if (!existsSync(resolve(dayPath, 'main.rs'))) {
    const rsContent = (
      await readFile(resolve(templatePath, 'main.rs'))
    ).toString();
    await writeFile(
      resolve(dayPath, 'main.rs'),
      rsContent.replaceAll('/{}-{}.', `/${year}-${day}.`),
    );
  }
}
