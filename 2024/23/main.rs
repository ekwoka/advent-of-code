//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

use wasm_bindgen::prelude::*;
use std::collections::{HashMap, HashSet, VecDeque};

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

    for node in connected {
      let other = edges.get(node).unwrap();

      for computer in other {
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
pub fn part_two(input: &str) -> String {
  let mut edges = HashMap::<&str, HashSet<&str>>::new();
  input.lines()
    .filter_map(|line| line.split_once("-"))
    .for_each(|(a, b)| {
      if let Some(existing) = edges.get_mut(a) {
        existing.insert(b);
      } else {
        edges.insert(a, [b].into());
      }
      if let Some(existing) = edges.get_mut(b) {
        existing.insert(a);
      } else {
        edges.insert(b, [a].into());
      }
    });
  let mut queue = VecDeque::from([(HashSet::<&str>::new(), edges.keys().map(|k| k.to_owned()).collect::<HashSet<_>>())]);
  let mut checked_groups = HashSet::<String>::new();
  while let Some((visited, group)) = queue.pop_front() {
    let mut key = visited.iter().map(|s| s.to_owned()).collect::<Vec<_>>();
    key.sort();
    let key = key.join(",");
    if checked_groups.contains(key.as_str()) {
      continue;
    } else {
      checked_groups.insert(key);
    }
    if visited.len() == group.len() && visited.iter().all(|k| group.contains(k)) {
      let mut group = visited.into_iter().collect::<Vec<_>>();
      group.sort();
      return group.join(",");
    }
    group.iter().filter(|k| !visited.contains(*k)).for_each(|next| {
      let visited = HashSet::from([*next]).union(&visited).map(|k| k.to_owned()).collect::<HashSet<_>>();
      let connected = edges.get(next).unwrap().clone();
      let group = group.intersection(&connected).chain(vec![next].into_iter()).map(|k| k.to_owned()).collect::<HashSet<_>>();
      if let Some(idx) = queue.iter().position(|(_,remaining)| remaining.len() <= group.len()) {
        queue.insert(idx, (visited, group));
      } else {
        queue.push_back((visited, group));
      }
    })
  }
  format!("Nothing Found")
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-23.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 1_348));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-23.txt").trim();
        b.iter(move || assert_eq!(part_two(input), "am,bv,ea,gh,is,iy,ml,nj,nl,no,om,tj,yv"));
    }
}
