//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]
use wasm_bindgen::prelude::*;
use std::collections::{VecDeque, HashSet, HashMap};

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
pub fn part_two(input: &str) -> usize {
  let map = input.lines().map(|line| line.chars().collect::<Vec<_>>()).collect::<Vec<_>>();
  let mut score_map = HashMap::<((usize, usize), u8), (usize, HashSet<((usize, usize), u8)>)>::new();
  let mut queue: VecDeque<(usize, (usize, usize), u8, HashSet<((usize,usize), u8)>)> = VecDeque::new();
  queue.push_back((0, (1, map.len()-2), 1, HashSet::new()));

  while let Some((score, location, direction, mut path)) = queue.pop_front() {
    if let Some(old_score) = score_map.get_mut(&(location, direction)) {
      if old_score.0 == score {
        path.iter().for_each(|location| {
          old_score.1.insert(location.clone());
        });
      }
      continue;
    } else {
      score_map.insert((location, direction), (score, path.clone()));
      path.insert((location, direction));
    }
    if location == (map[0].len() - 2, 1) {
      let best_paths = collect_steps(&mut score_map, &path);
      return best_paths.len();
    }
    let forward = match direction {
      0 => (location.0, location.1 - 1),
      1 => (location.0 + 1, location.1),
      2 => (location.0, location.1 + 1),
      _ => (location.0 - 1, location.1)
    };
    if map[forward.1][forward.0] != '#' {
      if let Some(idx) = queue.iter().position(|(oscore,_,_,_)| *oscore > score+1) {
        queue.insert(idx, (score+1, forward, direction, path.clone()));
      } else {
        queue.push_back((score+1, forward, direction, path.clone()));
      }
    }
    if let Some(idx) = queue.iter().position(|(oscore,_,_,_)| *oscore > score+1000) {
      queue.insert(idx, (score+1000, location, match direction {
        0 => 1,
        1 => 2,
        2 => 3,
        _ => 0
      }, path.clone()));
      queue.insert(idx, (score+1000, location, match direction {
        0 => 3,
        1 => 0,
        2 => 1,
        _ => 2
      }, path.clone()));
    } else {
      queue.push_back((score+1000, location, match direction {
        0 => 1,
        1 => 2,
        2 => 3,
        _ => 0
      }, path.clone()));
      queue.push_back((score+1000, location, match direction {
        0 => 3,
        1 => 0,
        2 => 1,
        _ => 2
      }, path.clone()));
    }
  }
 0
}

fn collect_steps(path_map: &mut HashMap<((usize, usize), u8), (usize, HashSet<((usize, usize), u8)>)>, path: &HashSet<((usize, usize), u8)>) -> HashSet<(usize, usize)> {
  let mut steps = path.iter().map(|(location,_)| location.to_owned()).collect::<HashSet<(usize,usize)>>();
  let path_sets = path.iter().filter_map(|location| path_map.remove(location)).map(|(_,set)| set).collect::<Vec<_>>();
  for path_set in path_sets {
    collect_steps(path_map, &path_set).into_iter().for_each(|location| {steps.insert(location);})
  }
  steps
}

fn get_directions(location: &(usize,usize), direction: u8) -> Vec<((usize,usize), u8)>{
  let forward = match direction {
    0 => (location.0, location.1 - 1),
    1 => (location.0 + 1, location.1),
    2 => (location.0, location.1 + 1),
    _ => (location.0 - 1, location.1)
  };
  let right = match direction {
    0 => (location.0 + 1, location.1),
    1 => (location.0, location.1 + 1),
    2 => (location.0 - 1, location.1),
    _ => (location.0, location.1 - 1)
  };
  let left = match direction {
    0 => (location.0 - 1, location.1),
    1 => (location.0, location.1 - 1),
    2 => (location.0 + 1, location.1),
    _ => (location.0, location.1 + 1),
  };
  vec![
    (forward, direction.clone()),
    (left, match direction {
        0 => 3,
        1 => 0,
        2 => 1,
        _ => 2
    }),
    (right, match direction {
      0 => 1,
      1 => 2,
      2 => 3,
      _ => 0
    })
  ]
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
