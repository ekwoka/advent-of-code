//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

#[path = "../../utils/main.rs"]
mod utils;

use std::collections::HashSet;
use utils::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
enum Space {
    Roll,
    Empty,
}

impl From<char> for Space {
    fn from(c: char) -> Self {
        match c {
            '.' => Space::Empty,
            '@' => Space::Roll,
            _ => panic!("Invalid character"),
        }
    }
}

#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
    let grid: HashSet<Vec2> = input
        .lines()
        .enumerate()
        .flat_map(|(y, line)| {
            line.chars()
                .map(Space::from)
                .enumerate()
                .filter(|(_, space)| *space == Space::Roll)
                .map(move |(x, _)| Vec2::new(x as i32, y.clone() as i32))
        })
        .collect();

    grid.iter()
        .filter(|pos| {
            Vec2::NEIGHBORS
                .iter()
                .map(move |neighbor| *neighbor + **pos)
                .filter(|pos| grid.contains(&pos))
                .nth(3)
                .is_none()
        })
        .count()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
    let mut locations: HashSet<Vec2> = input
        .lines()
        .enumerate()
        .flat_map(|(y, line)| {
            line.chars()
                .map(Space::from)
                .enumerate()
                .filter(|(_, space)| *space == Space::Roll)
                .map(move |(x, _)| Vec2::new(x as i32, y.clone() as i32))
        })
        .collect();

    let initial_count = locations.len();

    let mut removed = true;
    while removed {
        removed = false;
        for pos in locations.clone().iter() {
            if Vec2::NEIGHBORS
                .iter()
                .map(move |neighbor| *neighbor + *pos)
                .filter(|pos| locations.contains(&pos))
                .nth(3)
                .is_none()
            {
                removed = true;
                locations.remove(pos);
            }
        }
    }
    initial_count - locations.len()
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-04.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 1367));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-04.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 9144));
    }
}
