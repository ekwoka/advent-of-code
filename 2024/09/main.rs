//! ```cargo
//! [dependencies]
//! ```
#![feature(let_chains)]
#![feature(test)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> u64 {
  let mut blocks = input.chars().enumerate().flat_map(|(idx,length)| {
    let content = match idx % 2 {
      0 => Some(idx/2),
      _ => None
    };
    (0..length.to_digit(10).unwrap()).map(move |_| content.clone())
  }).collect::<Vec<_>>();
  let mut marker = 0;
  while marker < blocks.len() {
    if blocks[marker].is_none() {
      let mut last = blocks.pop().flatten();
      while last.is_none() {
        last = blocks.pop().flatten();
      }
      blocks[marker] = last;
    }
    marker += 1;
  }
  blocks.iter().enumerate().map(|(idx,id)| (idx * id.unwrap_or(0)) as u64).sum()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> u64 {
  let filesystem = input.chars().enumerate().map(|(idx,length)| {
    let content = match idx % 2 {
      0 => Some(idx/2),
      _ => None
    };
    (0..length.to_digit(10).unwrap()).map(move |_| content.clone()).collect::<Vec<_>>()
  }).collect::<Vec<_>>();
  let mut blocks = filesystem.into_iter().flatten().collect::<Vec<_>>();
  let mut marker = blocks.len()-1;
  while marker > 0 {
    if let Some(id) = blocks[marker] {
      let mut size = 1i32;
      while marker > 0 && let Some(next_id) = blocks[marker-1] {
        if next_id == id {
          size += 1;
          marker -= 1;
        } else {
          break;
        }
      }
      let mut empty_marker = 0;
      while empty_marker < marker {
        while let Some(_) = blocks[empty_marker] {
          empty_marker += 1;
        }
        let mut empty_size = 1;
        while empty_marker + 1 < blocks.len() && let None = blocks[empty_marker+1] {
          empty_size += 1;
          empty_marker += 1;
        }
        if empty_size >= size && (empty_marker + 1 - size as usize) < marker {
          while size > 0 {
            blocks[empty_marker + 1 - empty_size as usize] = Some(id);
            blocks[marker] = None;
            size -= 1;
            marker += 1;
            empty_size -= 1;
          }
          break
        }
        empty_marker += 1;
      }
    }
    marker = marker.checked_sub(1).unwrap_or(0);
  }
  blocks.iter().enumerate().map(|(idx,id)| (idx * id.unwrap_or(0)) as u64).sum()
}


#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-09.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-09.txt").trim();
        b.iter(move || part_two(input));
    }
}
