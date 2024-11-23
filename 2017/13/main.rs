//! ```cargo
//! [dependencies]
//! ```

use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String) -> usize {
  input.lines()
    .map(|ln| ln.split(": ")
      .map(|n| n.parse::<usize>().unwrap())
      .collect::<Vec<_>>())
    .filter(|n| (n[0] % (n[1] + n[1] - 2)) == 0)
    .map(|n| n[0] * n[1])
    .sum()
}

#[wasm_bindgen]
pub fn part_two(input: String) -> usize {
  let firewalls = input.lines()
    .map(|ln| ln.split(": ")
      .map(|n| n.parse::<usize>().unwrap())
      .collect::<Vec<_>>()).collect::<Vec<_>>();
  (0..).find(|delay| firewalls.iter().all(|f| ((f[0] + delay) % (f[1] * 2 - 2)) != 0)).expect("There should be a valid answer")
}
