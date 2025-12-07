//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

#[path = "../../utils/main.rs"]
mod utils;

use std::collections::HashMap;
use std::collections::HashSet;
use utils::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
    let splitters: HashSet<Vec2> = input
        .lines()
        .enumerate()
        .flat_map(|(y, line)| {
            line.chars().enumerate().filter_map(move |(x, c)| match c {
                '^' => Some(Vec2::new(x as i32, y as i32)),
                _ => None,
            })
        })
        .collect();
    let length = input.lines().count();
    let mut tachyons: HashSet<i32> = HashSet::new();
    tachyons.insert(
        input
            .lines()
            .next()
            .unwrap()
            .chars()
            .enumerate()
            .find_map(|(x, c)| match c {
                'S' => Some(x as i32),
                _ => None,
            })
            .unwrap(),
    );

    let mut splits = 0;
    for y in 1..length {
        let mut new_tachyons = HashSet::new();
        for tachyon in tachyons {
            if splitters.contains(&Vec2::new(tachyon, y as i32)) {
                splits += 1;
                new_tachyons.insert(tachyon + 1);
                new_tachyons.insert(tachyon - 1);
            } else {
                new_tachyons.insert(tachyon);
            }
        }
        tachyons = new_tachyons;
    }
    splits
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> u64 {
    let splitters: HashSet<Vec2> = input
        .lines()
        .enumerate()
        .flat_map(|(y, line)| {
            line.chars().enumerate().filter_map(move |(x, c)| match c {
                '^' => Some(Vec2::new(x as i32, y as i32)),
                _ => None,
            })
        })
        .collect();
    let length = input.lines().count();
    let mut active_tachyons: HashMap<i32, u64> = HashMap::new();
    active_tachyons.insert(
        input
            .lines()
            .next()
            .unwrap()
            .chars()
            .enumerate()
            .find_map(|(x, c)| match c {
                'S' => Some(x as i32),
                _ => None,
            })
            .unwrap(),
        1,
    );

    for y in 1..length {
        let mut new_tachyons = HashMap::new();
        for (pos, count) in active_tachyons.into_iter() {
            if splitters.contains(&Vec2::new(pos, y as i32)) {
                new_tachyons
                    .entry(pos - 1)
                    .and_modify(|v| *v += count)
                    .or_insert(count);
                new_tachyons
                    .entry(pos + 1)
                    .and_modify(|v| *v += count)
                    .or_insert(count);
            } else {
                new_tachyons
                    .entry(pos)
                    .and_modify(|v| *v += count)
                    .or_insert(count);
            }
        }
        active_tachyons = new_tachyons;
    }

    active_tachyons.values().sum()
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-07.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 1_566));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-07.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 5_921_061_943_075));
    }
}
