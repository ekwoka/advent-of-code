import { LoaderConfig, T } from 'hyperimport';
export default {
  buildCommand: [
    'rustc',
    '--crate-type',
    'cdylib',
    '/Users/claire/git/advent-of-code/2023/01/main.rs',
    '--out-dir',
    'target/2023-01.rs',
  ],
  outDir: 'target/2023-01.rs',
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
