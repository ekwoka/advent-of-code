//! ```cargo
//! [dependencies]
//! ```
//! --- Day 2: Red-Nosed Reports ---
//! Part    Time       Rank
//!   1     08:04:44   56936
//!   2     08:14:26   39859
//!
//! We get stuck needing to help check the safety reports for the nuclear reactor!
//! We need identify reports that indicate something might be wrong
#![feature(iter_map_windows)]
#![feature(test)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}

/// For Part one we identify all reports that don't follow the safety rules
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
  input.lines()
    .filter(|line|
      line.split_whitespace()
      .filter_map(|n| n.parse::<usize>().ok())
      .map_windows(|[a,b]| (a.abs_diff(*b), a > b))
      .scan(0i8, |state, (diff, desc)| {
        match state {
          1 => {
            if desc {
              Some(0)
            } else {
              Some(diff)
            }
          },
          -1 => {
            if desc {
              Some(diff)
            } else {
              Some(0)
            }
          },
          _ => {
            if desc {
              *state = -1;
              Some(diff)
            } else {
              *state = 1;
              Some(diff)
            }
          }
        }
      })
      .all(|c| c >= 1 && c <= 3)
    ).count()
}

/// For Part 2 we need to also count reports that only have ONE problem
/// I just brute forced it so I could keep abusing iterators
#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
  input.lines()
    .map(|line|
      line.split_whitespace()
      .filter_map(|n| n.parse::<usize>().ok()).collect::<Vec<_>>()
    )
    .filter(|readings| {
      readings.iter()
        .map_windows(|[a,b]| (a.abs_diff(**b), a > b))
        .scan(0i8, |state, (diff, desc)| {
          match state {
            1 => {
              if desc {
                Some(0)
              } else {
                Some(diff)
              }
            },
            -1 => {
              if desc {
                Some(diff)
              } else {
                Some(0)
              }
            },
            _ => {
              if desc {
                *state = -1;
                Some(diff)
              } else {
                *state = 1;
                Some(diff)
              }
            }
          }
        })
        .all(|c| c >= 1 && c <= 3) ||
      (0..readings.len()).filter(|idx|
        readings.iter().enumerate().filter(|(i,_)| i != idx).map(|(_,n)| n)
        .map_windows(|[a,b]| (a.abs_diff(**b), a > b))
        .scan(0i8, |state, (diff, desc)| {
          match state {
            1 => {
              if desc {
                Some(0)
              } else {
                Some(diff)
              }
            },
            -1 => {
              if desc {
                Some(diff)
              } else {
                Some(0)
              }
            },
            _ => {
              if desc {
                *state = -1;
                Some(diff)
              } else {
                *state = 1;
                Some(diff)
              }
            }
          }
        })
        .all(|c| c >= 1 && c <= 3)
      ).take(1).count() != 0
    }
    ).count()
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-02.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-02.txt").trim();
        b.iter(move || part_two(input));
    }
}
