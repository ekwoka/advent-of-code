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
    let mut visited: HashSet<Vec2> = HashSet::new();
    let mut stack = Vec::new();
    stack.push(
        input
            .lines()
            .next()
            .unwrap()
            .chars()
            .enumerate()
            .find_map(|(x, c)| match c {
                'S' => Some(Vec2::new(x as i32, 0)),
                _ => None,
            })
            .unwrap(),
    );

    let mut splits = 0;
    while let Some(tachyon) = stack.pop() {
        if tachyon.y >= length as i32 {
            continue;
        }
        if visited.contains(&tachyon) {
            continue;
        }
        visited.insert(tachyon.clone());
        let next = tachyon + Vec2::Y;
        if splitters.contains(&next) {
            splits += 1;
            vec![Vec2::NEG_X, Vec2::X]
                .into_iter()
                .map(|dir| dir + next)
                .for_each(|dir| stack.push(dir));
        } else {
            stack.push(next);
        }
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
    let mut active_tachyons: HashMap<Vec2, u64> = HashMap::new();
    active_tachyons.insert(
        input
            .lines()
            .next()
            .unwrap()
            .chars()
            .enumerate()
            .find_map(|(x, c)| match c {
                'S' => Some(Vec2::new(x as i32, 0)),
                _ => None,
            })
            .unwrap(),
        1,
    );

    for _ in 0..length {
        let mut new_tachyons = HashMap::new();
        for (pos, count) in active_tachyons.into_iter() {
            let next = pos + Vec2::Y;
            if splitters.contains(&next) {
                new_tachyons
                    .entry(next + Vec2::NEG_X)
                    .and_modify(|v| *v += count)
                    .or_insert(count);
                new_tachyons
                    .entry(next + Vec2::X)
                    .and_modify(|v| *v += count)
                    .or_insert(count);
            } else {
                new_tachyons
                    .entry(next)
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
