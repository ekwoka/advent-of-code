//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
  let (grid, instructions) = input.split_once("\n\n").unwrap();
  let mut map = grid.lines().map(|line| line.chars().collect::<Vec<_>>()).collect::<Vec<_>>();
  let mut robot = grid.lines().enumerate()
    .flat_map(|(y, line)| line.chars()
      .enumerate()
      .filter(|(_,ch)| ch == &'@')
      .map(move |(x, _)| (x as i32,y as i32))
    )
    .nth(0).unwrap();
  map[robot.1 as usize][robot.0 as usize] = '.';
  for movement in instructions.chars()
    .map(|ch| match ch {
      '<' => (-1, 0),
      '^' => (0, -1),
      '>' => (1, 0),
      'v' => (0, 1),
      _ => (0,0)
    }) {

    match map[(robot.1 + movement.1) as usize][(robot.0 + movement.0) as usize] {
      '#' => continue,
      '.' => {
        robot.0 += movement.0;
        robot.1 += movement.1;
      },
      'O' => {
        let mut marker = robot.clone();
        'inner: loop {
          marker.0 += movement.0;
          marker.1 += movement.1;
          if map[marker.1 as usize][marker.0 as usize] != 'O' {
            break 'inner;
          }
        }
        match map[marker.1 as usize][marker.0 as usize] {
          '#' => continue,
          '.' => {
            map[marker.1 as usize][marker.0 as usize] = 'O';
            robot.0 += movement.0;
            robot.1 += movement.1;
            map[robot.1 as usize][robot.0 as usize] = '.';
          },
          _ => ()
        }
      },
      _ => ()
    }
  }
  map.iter()
    .enumerate()
    .flat_map(|(y,row)| row.iter()
      .enumerate()
      .filter(|(_, ch)| ch == &&'O')
      .map(move |(x,_)| y * 100 + x))
    .sum()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
  let (grid, instructions) = input.split_once("\n\n").unwrap();
  let mut map = grid.lines().map(|line| line.chars().flat_map(|ch| match ch {
    '#' => ['#', '#'],
    'O' => ['[',']'],
    ch => [ch, '.']
  }).collect::<Vec<_>>()).collect::<Vec<_>>();
  let mut robot = map.iter().enumerate()
    .flat_map(|(y, line)| line.iter()
      .enumerate()
      .filter(|(_,ch)| *ch == &'@')
      .map(move |(x, _)| (x as i32,y as i32))
    )
    .nth(0).unwrap();
  map[robot.1 as usize][robot.0 as usize] = '.';
  for movement in instructions.chars()
    .map(|ch| match ch {
      '<' => (-1, 0),
      '^' => (0, -1),
      '>' => (1, 0),
      'v' => (0, 1),
      _ => (0,0)
    }) {
    match map[(robot.1 + movement.1) as usize][(robot.0 + movement.0) as usize] {
      '#' => continue,
      '.' => {
        robot.0 += movement.0;
        robot.1 += movement.1;
      },
      '[' => {
          block_search((robot.0 + movement.0, robot.1 + movement.1), movement.clone(), &map).map(|positions| {
          let mut visited = std::collections::HashSet::<(i32,i32)>::new();
          positions.into_iter().for_each(|pos| {
            if visited.contains(&pos) {
              return;
            }
            visited.insert(pos.clone());
            map[(pos.1 + movement.1) as usize][(pos.0 + movement.0) as usize] = map[pos.1 as usize][pos.0 as usize];
            map[pos.1 as usize][pos.0 as usize] = '.';
          });
          robot.0 += movement.0;
          robot.1 += movement.1;
        });
      },
      ']' => {
        block_search((robot.0 + movement.0, robot.1 + movement.1), movement.clone(), &map).map(|positions| {
          let mut visited = std::collections::HashSet::<(i32,i32)>::new();
        positions.into_iter().for_each(|pos| {
          if visited.contains(&pos) {
              return;
            }
            visited.insert(pos.clone());
          map[(pos.1 + movement.1) as usize][(pos.0 + movement.0) as usize] = map[pos.1 as usize][pos.0 as usize];
          map[pos.1 as usize][pos.0 as usize] = '.';
        });
        robot.0 += movement.0;
        robot.1 += movement.1;
      });},
      _ => ()
    }
  }
  map.iter()
    .enumerate()
    .flat_map(|(y,row)| row.iter()
      .enumerate()
      .filter(|(_, ch)| ch == &&'[')
      .map(move |(x,_)| y * 100 + x))
    .sum()
}

fn block_search(position: (i32, i32), movement: (i32, i32), map: &Vec<Vec<char>>) -> Option<Vec<(i32, i32)>> {
  match map[position.1 as usize][position.0 as usize] {
    '[' => if movement.1 == 0 {
        if let Some(aside) = block_search((position.0 + movement.0, position.1 + movement.1), movement.clone(), map) {
          Some(aside.into_iter().chain(vec![position].into_iter()).collect())
        } else {
          None
        }
      } else {
        if let Some(next) =
          block_search((position.0, position.1 + movement.1), movement.clone(), map) {
            if let Some(beyond) = block_search((position.0 + 1, position.1 + movement.1), movement.clone(), map) {
              Some(next.into_iter().chain(beyond.into_iter()).chain(vec![position, (position.0 + 1, position.1)].into_iter()).collect())
            } else {
              None
            }
          } else {
            None
          }
      },
    ']' => if movement.1 == 0 {
        if let Some(aside) = block_search((position.0 + movement.0, position.1 + movement.1), movement.clone(), map) {
          Some(aside.into_iter().chain(vec![position].into_iter()).collect())
        } else {
          None
        }
      } else {
        if let Some(next) =
          block_search((position.0, position.1 + movement.1), movement.clone(), map) {
            if let Some(beyond) = block_search((position.0 - 1, position.1 + movement.1), movement.clone(), map) {
              Some(next.into_iter().chain(beyond.into_iter()).chain(vec![position, (position.0 - 1, position.1)].into_iter()).collect())
            } else {
              None
            }
          } else {
            None
          }
      },
    '#' => None,
    '.' => Some(vec![]),
    _ => None
  }
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-15.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-15.txt").trim();
        b.iter(move || part_two(input));
    }
}
