import { type LoaderConfig, T } from 'hyperimport';
export default {
  buildCommand: [
    'rustc',
    '--crate-type',
    'cdylib',
    '/Users/claire/git/advent-of-code/2023/02/main-day2.rs',
    '--out-dir',
    'build/main-day2.rs',
  ],
  outDir: 'build/main-day2.rs',
  symbols: {
    part_one: {
      args: [T.cstring],
      returns: T.i32,
    },
    part_two: {
      args: [T.cstring],
      returns: T.i32,
    },
  },
} satisfies LoaderConfig.Main;
