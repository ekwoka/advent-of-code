//! ```cargo
//! [dependencies]
//! ```
#![feature(test, let_chains, iter_map_windows)]

#[path = "../../utils/main.rs"]
mod utils;

use utils::*;
use wasm_bindgen::prelude::*;
use std::collections::HashMap;

#[wasm_bindgen(start)]
pub fn main() {
  console_error_panic_hook::set_once();
}

#[derive(PartialEq)]
enum Action {
  Activate,
  Up,
  Down,
  Left,
  Right
}

impl Action {
  const ALL: [Action; 5] = [Action::Up, Action::Down, Action::Left, Action::Right, Action::Activate];
}

struct NumericPad {
  button: char
}

impl NumericPad {
  fn new() -> Self {
    Self {
      button: 'A'
    }
  }
  fn goto(&mut self, target: char) -> Vec<char> {
    let movements = match (self.button, target) {
      ('A', 'A') => "A",
      ('A', '0') => "<A",
      ('A', '1') => "^<<A",
      ('A', '2') => "<^A",
      ('A', '3') => "^A",
      ('A', '4') => "^^<<A",
      ('A', '5') => "<^^A",
      ('A', '6') => "^^A",
      ('A', '7') => "^^^<<A",
      ('A', '8') => "<^^^A",
      ('A', '9') => "^^^A",
      ('0', 'A') => ">A",
      ('0', '0') => "A",
      ('0', '1') => "^<A",
      ('0', '2') => "^A",
      ('0', '3') => ">^A",
      ('0', '4') => "^^<A",
      ('0', '5') => "^^A",
      ('0', '6') => ">^^A",
      ('0', '7') => "^^^<A",
      ('0', '8') => "^^^A",
      ('0', '9') => ">^^^A",
      ('1', 'A') => ">>vA",
      ('1', '0') => ">vA",
      ('1', '1') => "A",
      ('1', '2') => ">A",
      ('1', '3') => ">>A",
      ('1', '4') => "^A",
      ('1', '5') => ">^A",
      ('1', '6') => ">>^A",
      ('1', '7') => "^^A",
      ('1', '8') => ">^^A",
      ('1', '9') => ">>^^A",
      ('2', 'A') => "v>A",
      ('2', '0') => "vA",
      ('2', '1') => "<A",
      ('2', '2') => "A",
      ('2', '3') => ">A",
      ('2', '4') => "<^A",
      ('2', '5') => "^A",
      ('2', '6') => ">^A",
      ('2', '7') => "<^^A",
      ('2', '8') => "^^A",
      ('2', '9') => ">^^A",
      ('3', 'A') => "vA",
      ('3', '0') => "<vA",
      ('3', '1') => "<<A",
      ('3', '2') => "<A",
      ('3', '3') => "A",
      ('3', '4') => "<<^A",
      ('3', '5') => "<^A",
      ('3', '6') => "^A",
      ('3', '7') => "<<^^A",
      ('3', '8') => "<^^A",
      ('3', '9') => "^^A",
      ('4', 'A') => ">>vvA",
      ('4', '0') => ">vvA",
      ('4', '1') => "vA",
      ('4', '2') => "v>A",
      ('4', '3') => "v>>A",
      ('4', '4') => "A",
      ('4', '5') => ">A",
      ('4', '6') => ">>A",
      ('4', '7') => "^A",
      ('4', '8') => ">^A",
      ('4', '9') => ">>^A",
      ('5', 'A') => "vv>A",
      ('5', '0') => "vvA",
      ('5', '1') => "<vA",
      ('5', '2') => "vA",
      ('5', '3') => "v>A",
      ('5', '4') => "<A",
      ('5', '5') => "A",
      ('5', '6') => ">A",
      ('5', '7') => "<^A",
      ('5', '8') => "^A",
      ('5', '9') => ">^A",
      ('6', 'A') => "vvA",
      ('6', '0') => "<vvA",
      ('6', '1') => "<<vA",
      ('6', '2') => "<vA",
      ('6', '3') => "vA",
      ('6', '4') => "<<A",
      ('6', '5') => "<A",
      ('6', '6') => "A",
      ('6', '7') => "<<^A",
      ('6', '8') => "<^A",
      ('6', '9') => "^A",
      ('7', 'A') => ">>vvvA",
      ('7', '0') => ">vvvA",
      ('7', '1') => "vvA",
      ('7', '2') => "vv>A",
      ('7', '3') => "vv>>A",
      ('7', '4') => "vA",
      ('7', '5') => "v>A",
      ('7', '6') => "v>>A",
      ('7', '7') => "A",
      ('7', '8') => ">A",
      ('7', '9') => ">>A",
      ('8', 'A') => "vvv>A",
      ('8', '0') => "vvvA",
      ('8', '1') => "<vvA",
      ('8', '2') => "vvA",
      ('8', '3') => "vv>A",
      ('8', '4') => "<vA",
      ('8', '5') => "vA",
      ('8', '6') => "v>A",
      ('8', '7') => "<A",
      ('8', '8') => "A",
      ('8', '9') => ">A",
      ('9', 'A') => "vvvA",
      ('9', '0') => "<vvvA",
      ('9', '1') => "<<vvA",
      ('9', '2') => "<vvA",
      ('9', '3') => "vvA",
      ('9', '4') => "<<vA",
      ('9', '5') => "<vA",
      ('9', '6') => "vA",
      ('9', '7') => "<<A",
      ('9', '8') => "<A",
      ('9', '9') => "A",
      _ => unreachable!()
    };
    self.button = target;
    movements.chars().collect::<Vec<_>>()
  }
}

struct DirectionalPad {
  button: char
}

impl DirectionalPad {
  fn new() -> Self {
    Self {
      button: 'A'
    }
  }
  fn goto(&mut self, target: char) -> Vec<char> {
    let movements = match (self.button, target) {
      ('A', 'A') => "A",
      ('A', '^') => "<A",
      ('A', '<') => "v<<A",
      ('A', 'v') => "<vA",
      ('A', '>') => "vA",
      ('^', 'A') => ">A",
      ('^', '^') => "A",
      ('^', '<') => "v<A",
      ('^', 'v') => "vA",
      ('^', '>') => "v>A",
      ('<', 'A') => ">>^A",
      ('<', '^') => ">^A",
      ('<', '<') => "A",
      ('<', 'v') => ">A",
      ('<', '>') => ">>A",
      ('v', 'A') => "^>A",
      ('v', '^') => "^A",
      ('v', '<') => "<A",
      ('v', 'v') => "A",
      ('v', '>') => ">A",
      ('>', 'A') => "^A",
      ('>', '^') => "<^A",
      ('>', '<') => "<<A",
      ('>', 'v') => "<A",
      ('>', '>') => "A",
      _ => unreachable!()
    };
    self.button = target;
    movements.chars().collect::<Vec<_>>()
  }
}

#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
  input.lines()
    .map(|code| {
      let mut numpad = NumericPad::new();
      let mut dpad_1 = DirectionalPad::new();
      let mut dpad_2 = DirectionalPad::new();
      code.chars()
        .flat_map(|ch| numpad.goto(ch).into_iter())
        .flat_map(|ch| dpad_1.goto(ch).into_iter())
        .flat_map(|ch| dpad_2.goto(ch).into_iter())
        /* .collect::<String>() */
        .count() * code[0..3].parse::<usize>().unwrap()
    })
   /*  .last().unwrap() */
    /* .collect() */
    .sum()
}

#[wasm_bindgen]
pub fn part_two(input: &str, depth: usize) -> String {
  let mut cache = HashMap::<(char, char, usize), Vec<char>>::new();
  input.lines()
    .map(|code| {
      let mut numpad = NumericPad::new();
      code.chars()
        .flat_map(|ch| vec!['A'].into_iter().chain(numpad.goto(ch).into_iter()))
        .map_windows(|[from, to]| calculate_directional_path_from_depth(&mut cache, *from, *to, depth))
        .flat_map(|steps| steps.into_iter())
        .collect::<String>()/*  * code[0..3].parse::<usize>().unwrap() */
    })
    .nth(0).unwrap()
}

fn calculate_directional_path_from_depth(cache: &mut HashMap<(char, char, usize), Vec<char>>, from: char, to: char, depth: usize) -> Vec<char> {
  if cache.contains_key(&(from, to, depth)) {
    return cache.get(&(from, to, depth)).unwrap().clone();
  }
  let mut dpad = DirectionalPad::new();
  dpad.goto(from);
  if depth == 0 {
    return vec![to];
  }
  let path = dpad.goto(to).into_iter()
    .map_windows(|[from, to]| calculate_directional_path_from_depth(cache, *from, *to, depth - 1))
    .flat_map(|steps| steps.into_iter())
    .collect::<Vec<_>>();
  cache.insert((from, to, depth), path.clone());
  path
}

#[cfg(test)]
mod tests {
  extern crate test;
  use super::*;
  use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-21.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 0));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../utils/.cache/2024-21.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 0));
    }
}
