//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]
use wasm_bindgen::prelude::*;
use std::collections::{VecDeque, HashSet};

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
  let map = input.lines().map(|line| line.chars().collect::<Vec<_>>()).collect::<Vec<_>>();
  let mut queue: VecDeque<(usize, (usize, usize), u8)> = VecDeque::new();
  queue.push_back((0, (1, map.len()-2), 1));

  let mut visited: HashSet<((usize, usize), u8)> = HashSet::new();

  while let Some((score, location, direction)) = queue.pop_front() {
    if visited.contains(&(location, direction)) {
      continue;
    } else {
      visited.insert((location, direction));
    }
    if location == (map[0].len() - 2, 1) {
      return score
    }
    let forward = match direction {
      0 => (location.0, location.1 - 1),
      1 => (location.0 + 1, location.1),
      2 => (location.0, location.1 + 1),
      _ => (location.0 - 1, location.1)
    };
    if map[forward.1][forward.0] != '#' {
      if let Some(idx) = queue.iter().position(|(oscore,_,_)| *oscore > score+1) {
        queue.insert(idx, (score+1, forward, direction));
      } else {
        queue.push_back((score+1, forward, direction));
      }
    }
    if let Some(idx) = queue.iter().position(|(oscore,_,_)| *oscore > score+1000) {
      queue.insert(idx, (score+1000, location, match direction {
        0 => 1,
        1 => 2,
        2 => 3,
        _ => 0
      }));
      queue.insert(idx, (score+1000, location, match direction {
        0 => 3,
        1 => 0,
        2 => 1,
        _ => 2
      }));
    } else {
      queue.push_back((score+1000, location, match direction {
        0 => 1,
        1 => 2,
        2 => 3,
        _ => 0
      }));
      queue.push_back((score+1000, location, match direction {
        0 => 3,
        1 => 0,
        2 => 1,
        _ => 2
      }));
    }
  }
  0
}

#[wasm_bindgen]
pub fn part_two(input: &str, best_score: usize) -> usize {
  let map = input.lines().map(|line| line.chars().collect::<Vec<_>>()).collect::<Vec<_>>();
  let mut queue: VecDeque<(usize, (usize, usize), u8, HashSet<((usize,usize), u8)>)> = VecDeque::new();
  queue.push_back((0, (1, map.len()-2), 1, HashSet::new()));

  let mut best_path: HashSet<(usize, usize)> = HashSet::new();

  while let Some((score, location, direction, mut path)) = queue.pop_back() {
    if score > best_score {
      continue;
    }
    if path.contains(&(location, direction)) || path.contains(&(location, match direction {
      0 => 2,
      1 => 3,
      2 => 0,
      _ => 1
    })) {
      continue;
    } else {
      path.insert((location, direction));
    }
    if location == (map[0].len() - 2, 1) {
      path.into_iter().for_each(|(space, _)| {
        best_path.insert(space);
      });
      continue;
    }
    let forward = match direction {
      0 => (location.0, location.1 - 1),
      1 => (location.0 + 1, location.1),
      2 => (location.0, location.1 + 1),
      _ => (location.0 - 1, location.1)
    };
    if map[forward.1][forward.0] != '#' {
        queue.push_back((score+1, forward, direction, path.clone()));
    }
    let right = match direction {
      0 => (location.0 + 1, location.1),
      1 => (location.0, location.1 + 1),
      2 => (location.0 - 1, location.1),
      _ => (location.0, location.1 - 1)
    };
    if map[right.1][right.0] != '#' {
      queue.push_back((score+1000, location, match direction {
        0 => 1,
        1 => 2,
        2 => 3,
        _ => 0
      }, path.clone()));
    }
     let left = match direction {
       0 => (location.0 - 1, location.1),
      1 => (location.0, location.1 - 1),
      2 => (location.0 + 1, location.1),
      _ => (location.0, location.1 + 1),
    };
    if map[left.1][left.0] != '#' {
      queue.push_back((score+1000, location, match direction {
        0 => 3,
        1 => 0,
        2 => 1,
        _ => 2
      }, path.clone()));
    }
  }
  best_path.len()
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-16.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-16.txt").trim();
        b.iter(move || part_two(input));
    }
}
