//! ```cargo
//! [dependencies]
//! ```
//! --- Day 1: Historian Hysteria ---
//! Part    Time       Rank
//!   1     00:14:57   5633
//!   2     00:19:05   5049
//!
//! To find places the Chief Historian might be, we need to look for places
//! that show up often on both lists
#![feature(test)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}

/// For Part One we find the absolute difference between pairs
/// from list one and list two after they are sorted
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
    let (mut list_one, mut list_two) = input
        .lines()
        .map(|line| {
            line.split_whitespace()
                .filter_map(|n| n.parse::<usize>().ok())
                .collect::<Vec<_>>()
        })
        .fold((vec![], vec![]), |mut vecs, nums| {
            vecs.0.push(nums[0]);
            vecs.1.push(nums[1]);
            vecs
        });
    list_one.sort();
    list_two.sort();
    list_one
        .iter()
        .zip(list_two.iter())
        .map(|(l, r)| l.abs_diff(*r))
        .sum()
}

/// Part Two just wants the total times a number from list one appears in list two
#[wasm_bindgen]
pub fn part_two(input: &str) -> usize {
    let (list_one, list_two) = input
        .lines()
        .map(|line| {
            line.split_whitespace()
                .filter_map(|n| n.parse::<usize>().ok())
                .collect::<Vec<_>>()
        })
        .fold((vec![], vec![]), |mut vecs, nums| {
            vecs.0.push(nums[0]);
            vecs.1.push(nums[1]);
            vecs
        });
    list_one
        .iter()
        .map(|num| num * list_two.iter().filter(|num2| *num2 == num).count())
        .sum()
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-01.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-01.txt").trim();
        b.iter(move || part_two(input));
    }
}
