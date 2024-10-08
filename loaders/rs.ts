import { watch } from 'node:fs';
import { exists, mkdir } from 'node:fs/promises';
import { basename, relative, resolve } from 'node:path';
import { type PluginBuilder, plugin } from 'bun';

const cacheDir = resolve(process.cwd(), 'node_modules/.bun-cache');

class RustLoader {
  constructor(private path: string) {}

  async shouldRebuild() {
    if (!(await exists(this.cargoDir)))
      return `Cache for module ${this.libName} does not exist`;
    if (
      !(await exists(
        resolve(
          this.cargoDir,
          'target',
          'wasm32-unknown-unknown',
          process.env.RS_DEV ? 'debug' : 'release',
        ),
      ))
    )
      return `pkg for module ${this.libName} does not exist`;
    const lmin = lastModified(this.path);
    const lmout = lastModified(
      resolve(
        this.cargoDir,
        'target',
        'wasm32-unknown-unknown',
        process.env.RS_DEV ? 'debug' : 'release',
      ),
    );
    if (lmin > lmout) return `Module ${this.libName} is newer than its cache`;
    return false;
  }

  async makeCargo() {
    await mkdir(this.cargoDir, { recursive: true });
    const cargoToml = makeCargoToml(
      this.libName,
      relative(this.cargoDir, this.path),
    );
    await Bun.write(resolve(this.cargoDir, 'Cargo.toml'), cargoToml);
  }

  async build() {
    await Bun.spawn(
      [
        'wasm-pack',
        'build',
        '--target',
        'web',
        ...(process.env.RS_DEV ? ['--dev', '--no-opt'] : ['--release']),
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
  static setup(build: PluginBuilder) {
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

const makeCargoToml = (name: string, relativePath: string) => `
[package]
name = "wasm-${name}"
version = "0.1.0"
edition = "2021"

[dependencies]
fancy-regex = "0.13.0"
wasm-bindgen = "0.2.93"
js-sys = "0.3"
console_error_panic_hook = "0.1.7"

[lib]
crate-type = ["cdylib","rlib"]
path = "${relativePath}"

[profile.release]
lto = "fat"
panic = "abort"
opt-level = 3
codegen-units = 1
strip = "debuginfo"
`;
