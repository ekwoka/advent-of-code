declare module '*/main-day2.rs' {
  const symbols: import('bun:ffi').ConvertFns<
    typeof import('./config.ts').default.symbols
  >;
  export = symbols;
}
