//! ```cargo
//! [dependencies]
//! web-sys = { version = "0.3.76", features = ["console"] }
//! ```
#![feature(test)]
use wasm_bindgen::prelude::*;
use std::collections::{VecDeque, HashSet, HashMap};
use web_sys::console;

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

  let mut branches = HashMap::<((usize,usize),u8), (usize, (usize,usize), u8, HashSet<((usize,usize), u8)>)>::new();
  let mut branch_points = Vec::<((usize, usize), u8)>::new();
  branch_points.push(((1, map.len()-2), 1));
  let mut queued_points = HashSet::<((usize, usize), u8)>::new();

  while let Some((start_location, start_direction)) = branch_points.pop() {
    if get_directions(&start_location, start_direction).iter().filter(|((x,y),_)| map[*y][*x] != '#').count() >= 2 {
      continue;
    }
    console::log_1(&format!("Starting branch from {:?} going {}", start_location, start_direction).into());
    let mut location = start_location.clone();
    let mut direction = start_direction;
    let mut score = 0usize;
    let mut visited = HashSet::<((usize,usize), u8)>::new();

    loop {
      if location == (map[0].len() - 2, 1) {
        break;
      }

      let steps = get_directions(&location, direction);
      if steps.iter().filter(|((x,y),_)| map[*y][*x] != '#').count() == 0 {
        break;
      }
      if steps.iter().filter(|((x,y),_)| map[*y][*x] != '#').count() >= 2 {
        break;
      }
      visited.insert((location.clone(), direction));
      let forward = steps[0];
      let right = steps[1];
      let left = steps[2];

      if map[forward.0.1][forward.0.0] != '#' {
        location = forward.0;
        score += 1;
      } else if map[right.0.1][right.0.0] != '#' {
        location = right.0;
        score += 1001;
        direction = right.1;
      } else if map[left.0.1][left.0.0] !='#' {
        location = left.0;
        score += 1001;
        direction = left.1;
      }
    }

    console::log_1(&format!("Finished branch at {:?} with score: {}", location, score).into());

    branches.insert((start_location, start_direction), (score, location.clone(), direction, visited));

    let next_steps = get_directions(&location, direction);

    let forward = next_steps[0];
    if map[forward.0.1][forward.0.0] != '#' && !queued_points.contains(&forward) {
      branch_points.push(forward.clone());
      queued_points.insert(forward);
    }
    let right = next_steps[1];
    if map[right.0.1][right.0.0] != '#' && !queued_points.contains(&right) {
      branch_points.push(right.clone());
      queued_points.insert(right);
    }
    let left = next_steps[2];
    if map[left.0.1][left.0.0] != '#' && !queued_points.contains(&left) {
      branch_points.push(left.clone());
      queued_points.insert(left);
    }
  }

  let mut queue: VecDeque<(usize, (usize, usize), u8, HashSet<((usize,usize), u8)>)> = VecDeque::new();
  queue.push_back((0, (1, map.len()-2), 1, HashSet::new()));

  let mut best_paths: HashSet<(usize, usize)> = HashSet::new();

  while let Some((score, location, direction, mut path)) = queue.pop_back() {
    if score > best_score {
      continue;
    }
    if path.contains(&(location, direction.clone())) || path.contains(&(location, match direction {
      0 => 2,
      1 => 3,
      2 => 0,
      _ => 1
    })) {
      continue;
    } else {
      path.insert((location, direction.clone()));
    }
    if location == (map[0].len() - 2, 1) {
      path.into_iter().for_each(|(space, _)| {
        best_paths.insert(space);
      });
      continue;
    }

    if let Some((branch_score, location, direction, branch_path)) = branches.get(&(location.clone(), direction.clone())) {
      queue.push_back((score + branch_score, location.clone(), direction.clone(), path.iter().chain(branch_path.iter()).map(|v| v.to_owned()).collect()));
      continue;
    }

    let next_steps = get_directions(&location, direction.clone());

    let forward = next_steps[0];
    if map[forward.0.1][forward.0.0] != '#' {
        queue.push_back((score+1, forward.0, forward.1, path.clone()));
    }

    let right = next_steps[1];
    if map[right.0.1][right.0.0] != '#' {
      queue.push_back((score+1000, location, right.1, path.clone()));
    }

    let left = next_steps[2];
    if map[left.0.1][left.0.0] != '#' {
      queue.push_back((score+1000, location, left.1, path.clone()));
    }
  }
  best_paths.len()
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
        b.iter(move || part_two(input, 102488));
    }
}
