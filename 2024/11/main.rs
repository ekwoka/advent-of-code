//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}

fn expand(stone: &str, blinks: usize, map: &mut std::collections::HashMap<String,u64>) -> u64 {
  let key = format!("{stone}-{blinks}");
  if map.contains_key(&key) {
    return map.get(&key).unwrap().to_owned()
  }
  let count = match blinks {
    0 => 1u64,
    _ => {
      if stone == "0" || stone == "" {
        expand("1", blinks - 1, map)
      } else {
          match stone.len() & 1 {
          0 => expand(&stone[0..stone.len()/2],blinks-1, map) + expand(&stone[stone.len()/2..].trim_start_matches("0"),blinks-1, map),
          _ => expand(&format!("{}",stone.parse::<u64>().unwrap() * 2024).as_str(), blinks-1, map)
        }
      }
    }
  };
  map.insert(key, count);
  count
}
#[wasm_bindgen]
pub fn part_one(input: &str, blinks: usize) -> /* Vec<u64> */ u64 {
  let mut memoized = std::collections::HashMap::<String, u64>::new();
  input.split_whitespace().map(|stone| expand(stone, blinks, &mut memoized)).sum()
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-11.txt").trim();
        b.iter(move || part_one(input, 25));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-11.txt").trim();
        b.iter(move || part_one(input, 75));
    }
}
