//! ```cargo
//! [dependencies]
//! ```

use wasm_bindgen::prelude::*;
use std::cmp::Ordering;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String) -> usize {
  let rules = input.lines()
    .take_while(|line| line.len() > 1)
    .map(|line| line.split("|")
      .filter_map(|n| n.parse::<usize>().ok())
      .collect::<Vec<_>>())
    .map(|pages| (pages[0],pages[1]))
    .collect::<std::collections::HashSet<_>>();
  input.lines().skip(rules.len()+1)
    .map(|update| update.split(",").filter_map(|n| n.parse::<usize>().ok()).collect::<Vec<_>>())
    .filter(|update| update.is_sorted_by(|a,b| !rules.contains(&(*b,*a))))
    .map(|update| update[update.len()/2])
    .sum()
}

#[wasm_bindgen]
pub fn part_two(input: String) -> usize {
  let rules = input.lines()
    .take_while(|line| line.len() > 1)
    .map(|line| line.split("|")
      .filter_map(|n| n.parse::<usize>().ok())
      .collect::<Vec<_>>())
    .map(|pages| (pages[0],pages[1]))
    .collect::<std::collections::HashSet<_>>();
  input.lines().skip(rules.len()+1)
    .map(|update| update.split(",").filter_map(|n| n.parse::<usize>().ok()).collect::<Vec<_>>())
    .filter(|update| !update.is_sorted_by(|a,b| !rules.contains(&(*b,*a))))
    .map(|mut update| {
      update.sort_by(|a,b| {
        if rules.contains(&(*a,*b)) {
          Ordering::Less
        } else if rules.contains(&(*b,*a)) {
          Ordering::Greater
        } else {
          Ordering::Equal
        }
      });
      update
    })
    .map(|update| update[update.len()/2])
    .sum()
}
