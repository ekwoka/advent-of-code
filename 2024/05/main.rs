//! ```cargo
//! [dependencies]
//! ```
//! --- Day 5: Print Queue ---
//! Part    Time       Rank
//!   1     00:18:38   3673
//!   2     00:25:19   2338
//!
//! We check for the Cheif Historian in the Printing Department
//! Unfortunately we, being computer people, are recruited to fix a printer
//! ....
#![feature(test)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}

/// First we need to find, using strange printing rules
/// Which sets of updates are correct
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
  let (rules_lines, update_lines) = input.split_once("\n\n").unwrap();
  let rules = rules_lines.lines()
    .map(|line| line.split_once("|").unwrap())
    .map(|(page1, page2)| (page1.parse::<usize>().unwrap(), page2.parse::<usize>().unwrap()))
    .collect::<std::collections::HashSet<_>>();
  update_lines.lines()
    .map(|update| update.split(",").filter_map(|n| n.parse::<usize>().ok()).collect::<Vec<_>>())
    .filter(|update| update.is_sorted_by(|a,b| !rules.contains(&(*b,*a))))
    .map(|update| update[update.len()/2])
    .sum()
}

/// Next we need to find the incorrect ones, and make them correct
#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
  let (rules_lines, update_lines) = input.split_once("\n\n").unwrap();
  let rules = rules_lines.lines()
    .map(|line| line.split_once("|").unwrap())
    .map(|(page1, page2)| (page1.parse::<usize>().unwrap(), page2.parse::<usize>().unwrap()))
    .collect::<std::collections::HashSet<_>>();
  update_lines.lines()
    .map(|update| update.split(",").filter_map(|n| n.parse::<usize>().ok()).collect::<Vec<_>>())
    .filter(|update| !update.is_sorted_by(|a,b| !rules.contains(&(*b,*a))))
    .map(|mut update| {
      update.sort_by(|a,b| rules.contains(&(*a,*b)).cmp(&true));
      update[update.len()/2]
    })
    .sum()
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-05.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-05.txt").trim();
        b.iter(move || part_two(input));
    }
}
