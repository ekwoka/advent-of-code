import { LoaderConfig, T } from 'hyperimport';
export default {
  buildCommand: [
    'cargo',
    'rustc',
    '--manifest-path',
    'hyperimport/main-day4.rs/Cargo.toml',
    '--target-dir',
    'build',
  ],
  outDir: 'build/debug',
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
