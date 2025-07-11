import { exists, mkdir } from 'node:fs/promises';
import { basename, relative, resolve } from 'node:path';
import { type PluginBuilder, plugin } from 'bun';
import { AOCInput } from '../utils';

const cacheDir = resolve(process.cwd(), 'node_modules/.bun-cache');

class RustLoader {
  constructor(private path: string) {}

  async shouldRebuild() {
    if (!(await exists(this.cargoDir)))
      return `Cache for module ${this.libName} does not exist`;
    if (
      !(await exists(
        resolve(
          cacheDir,
          'target',
          'wasm32-unknown-unknown',
          process.env.RS_DEV === 'true' ? 'debug' : 'release',
          `wasm_${this.libName.replaceAll('-', '_')}.wasm`,
        ),
      ))
    )
      return `pkg for module ${this.libName} does not exist`;
    const lmin = lastModified(this.path);
    const lmout = lastModified(
      resolve(
        cacheDir,
        'target',
        'wasm32-unknown-unknown',
        process.env.RS_DEV === 'true' ? 'debug' : 'release',
        `wasm_${this.libName.replaceAll('-', '_')}.wasm`,
      ),
    );
    if (lmin > lmout) return `Module ${this.libName} is newer than its cache`;
    return false;
  }

  async makeCargo() {
    await mkdir(this.cargoDir, { recursive: true });
    const contents = await Bun.file(this.path).text();
    const cargoToml = makeCargoToml(
      this.libName,
      relative(this.cargoDir, this.path),
      contents,
    );
    await Bun.write(resolve(this.cargoDir, 'Cargo.toml'), cargoToml);
    const workspace = (
      await Bun.file(resolve(cacheDir, 'Cargo.toml')).text()
    ).split('\n');
    if (!workspace.some((line) => line.includes(this.libName))) {
      workspace.splice(workspace.length - 2, 0, `"${this.libName}",`);
      await Bun.write(resolve(cacheDir, 'Cargo.toml'), workspace.join('\n'));
    }
  }

  async build() {
    await Bun.spawn(
      [
        'rustup',
        'run',
        'nightly',
        'wasm-pack',
        'build',
        '--target',
        'web',
        ...(process.env.RS_DEV === 'true' ? ['--dev'] : ['--release']),
        this.cargoDir,
      ],
      {
        stdio: ['ignore', 'inherit', 'inherit'],
      },
    ).exited;
  }

  async prepareTypes() {
    const typesOutput = resolve(this.path, '..', `${basename(this.path)}.d.ts`);
    const typesInput = resolve(
      this.cargoDir,
      'pkg',
      `wasm_${this.libName.replaceAll('-', '_')}.d.ts`,
    );
    await Bun.write(typesOutput, Bun.file(typesInput));
  }

  async load(): Promise<Record<string, unknown>> {
    const module = await import(resolve(this.cargoDir, 'pkg'));
    await module.default();
    return module;
  }

  get cargoDir() {
    return resolve(cacheDir, this.libName);
  }

  get libName() {
    return relative(import.meta.url, this.path)
      .split('/')
      .filter((part) => part !== '..')
      .join('-')
      .replace('.rs', '-rs');
  }

  static name = 'Rust WASM Loader';
  static extension: 'rs';
  static async setup(build: PluginBuilder) {
    if (!(await exists(resolve(cacheDir, 'cargo.toml')))) {
      await mkdir(cacheDir, { recursive: true });
      await Bun.write(
        resolve(cacheDir, 'Cargo.toml'),
        `
[profile.release]
lto = "fat"
panic = "abort"
opt-level = 3
codegen-units = 1
strip = "debuginfo"

[workspace.package]
rust-version = "1.87"
edition = "2024"
version = "0.1.0"

[workspace]
resolver = "2"
members = [
]
`,
      );
    }
    build.onLoad({ filter: /\.rs$/ }, async (args) => {
      const module = new RustLoader(args.path);
      const shouldRebuild = await module.shouldRebuild();
      if (shouldRebuild) {
        console.log('Rebuilding module:', shouldRebuild);
        await module.makeCargo();
        await module.build();
        await module.prepareTypes();
      }
      return {
        exports: await module.load(),
        loader: 'object',
      };
    });
  }
}

/**
 * Returns the last modified time of the file.
 * @param path The path to the file.
 */
export const lastModified = (path: string) => Bun.file(path).lastModified;

export default RustLoader;
plugin(RustLoader);

// biome-ignore lint/complexity/noBannedTypes: Needed to accept subclasses of String
const isDocComment = (line: string | String) => line.startsWith('//!');
const makeCargoToml = (
  name: string,
  relativePath: string,
  contents: string,
) => {
  const commentLines = new AOCInput(contents).lines().filter(isDocComment);
  commentLines.takeWhile((line) => !line.includes('```cargo')).collect();
  let dependencies = `[dependencies]
console_error_panic_hook = "0.1.7"
regex = "1.11.1"
wasm-bindgen = "0.2.100"
web-sys = { version = "0.3.77", features = ["console"] }
`;
  if (commentLines.next().value?.includes('[dependencies]'))
    dependencies += commentLines
      .takeWhile((line) => !(line.trim() === '//!' || line.includes('```')))
      .map((line) => line.slice(3).trim())
      .collect()
      .join('\n');
  return `
[package]
name = "wasm-${name}"
version.workspace = true
edition.workspace = true
rust-version.workspace = true

${dependencies}

[lib]
crate-type = ["cdylib","rlib"]
path = "${relativePath}"

[package.metadata.wasm-pack.profile.release.wasm-bindgen]
debug-js-glue = false
demangle-name-section = false
dwarf-debug-info = false
omit-default-module-path = false

[package.metadata.wasm-pack.profile.dev]
wasm-opt = false

[package.metadata.wasm-pack.profile.release]
wasm-opt = ['-O4','--precompute','-n','--vacuum']

[lints.rust]
unexpected_cfgs = { level = "warn", check-cfg = ['cfg(wasm_bindgen_unstable_test_coverage)'] }
`;
};
