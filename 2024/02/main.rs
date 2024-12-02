//! ```cargo
//! [dependencies]
//! ```
#![feature(iter_map_windows)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String) -> usize {
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

#[wasm_bindgen]
pub fn part_two(input: String) -> usize {
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
