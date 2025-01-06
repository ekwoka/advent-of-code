//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

use wasm_bindgen::prelude::*;
// use regex::regex;
use std::collections::HashMap;
use std::collections::HashSet;
use std::collections::VecDeque;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> u64 {
  input.lines()
    .filter_map(|line| line.parse::<u64>().ok())
    .map(|secret| {
      (0..2000).fold(secret, |secret, _| {
        let secret = ((secret * 64) ^ secret) % 16_777_216;
        let secret = ((secret / 32) ^ secret) % 16_777_216;
        let secret = ((secret * 2048) ^ secret) % 16_777_216;
        secret
      })
    }).sum()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
  let mut values = HashMap::<(i8, i8, i8, i8), usize>::new();
  input.lines()
    .filter_map(|line| line.parse::<i64>().ok())
    .for_each(|secret| {
      let mut secret = secret;
      let mut diffs = VecDeque::<i8>::new();
      let mut seen = HashSet::<(i8,i8,i8,i8)>::new();
      for _ in 0..2000 {
        let inner_secret = ((secret << 6) ^ secret) & 16_777_215;
        let inner_secret = ((inner_secret / 32) ^ inner_secret) & 16_777_215;
        let inner_secret = ((inner_secret * 2048) ^ inner_secret) & 16_777_215;
        let a = secret.to_string().chars().last().unwrap().to_string().parse::<i8>().unwrap();
        let b = inner_secret.to_string().chars().last().unwrap().to_string().parse::<i8>().unwrap();
        let diff = b - a;
        diffs.push_back(diff);
        if diffs.len() > 4 {
          diffs.pop_front();

          let key = (diffs[0], diffs[1], diffs[2], diffs[3]);
          if !seen.contains(&key) {
            seen.insert(key.clone());
            if b != 0 {
              let existing = values.get(&key).unwrap_or(&0);
              values.insert(key, existing + b as usize);
            }
          }
        }
        secret = inner_secret;
      }
    });
  /* let mut possibilities = values.iter().map(|(key, val)| format!("{:?} -> {}", key, val)).collect::<Vec<_>>(); */
  values.values().max().unwrap().to_owned()
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-22.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 13_429_191_512));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-22.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 1_582));
    }
}
