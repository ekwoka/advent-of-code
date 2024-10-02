import { RustIterator } from '@ekwoka/rust-ts';
const iter = function <T>(this: Iterable<T>) {
  return new RustIterator(this);
};
String.prototype.iter = iter;
Array.prototype.iter = iter;
Set.prototype.iter = iter;
Map.prototype.iter = iter;
(function* () {})().constructor.prototype.iter = iter;
Object.getPrototypeOf(
  (function* () {
    yield 1;
  })().constructor.prototype,
).iter = iter;

interface Set<T> {
  iter(): RustIterator<T>;
}

interface Map<K, V> {
  iter(): RustIterator<[K, V]>;
}

interface String {
  iter(): RustIterator<string>;
}

interface Array<T> {
  iter(): RustIterator<T>;
}

interface Generator<T, _unk, __unk> {
  iter(): RustIterator<T>;
}

interface Iterator<T> {
  iter(): RustIterator<T>;
}

RustIterator.prototype.into = function (container: typeof Set | typeof Map) {
  return new container(this);
};
