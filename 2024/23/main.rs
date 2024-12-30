//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

#[path = "../../utils/main.rs"]
mod utils;

use utils::*;
use wasm_bindgen::prelude::*;
// use regex::regex;
use web_sys::console;
use std::collections::HashMap;
use std::collections::HashSet;
// use std::collections::VecDeque;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
  let mut edges = HashMap::<&str, Vec<&str>>::new();
  input.lines()
    .filter_map(|line| line.split_once("-"))
    .for_each(|(a, b)| {
      if let Some(existing) = edges.get_mut(a) {
        existing.push(b);
      } else {
        edges.insert(a, vec![b]);
      }
      if let Some(existing) = edges.get_mut(b) {
        existing.push(a);
      } else {
        edges.insert(b, vec![a]);
      }
    });
  let nodes = edges.keys().collect::<Vec<_>>();
  let mut groups = HashSet::<String>::new();
  for key in nodes {
    let connected = edges.get(key).unwrap();
    /* console::log_1(&format!("{key} -> {connected:?}").into()); */
    for node in connected {
      let other = edges.get(node).unwrap();
      /* console::log_1(&format!("{node} -> {other:?}").into()); */
      for computer in other {
       /*  console::log_1(&format!("{computer} -> {:?}", edges.get(computer).unwrap()).into()); */
        if edges.get(computer).unwrap().contains(&key) {
          let mut group = vec![key, node, computer];
          if group.iter().any(|node| node.starts_with("t")) {
            group.sort();
            groups.insert(format!("{group:?}"));
          }
        }
      }
    }
  }
  groups.len()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
  0
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-23.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 0));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-23.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 0));
    }
}
