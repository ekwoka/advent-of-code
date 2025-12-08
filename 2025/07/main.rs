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
    let mut lines = input.lines();

    let mut tachyons = lines
        .next()
        .unwrap()
        .chars()
        .map(|c| match c {
            'S' => 1,
            _ => 0,
        })
        .collect::<Vec<usize>>();
    let mut splits = 0;
    for line in lines.map(|line| line.chars().collect::<Vec<char>>()) {
        for i in 0usize..tachyons.len() {
            if tachyons[i] == 1 && line[i] == '^' {
                splits += 1;
                tachyons[i - 1] = 1;
                tachyons[i + 1] = 1;
                tachyons[i] = 0;
            }
        }
    }

    splits
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> u64 {
    let mut lines = input.lines();

    let mut tachyons = lines
        .next()
        .unwrap()
        .chars()
        .map(|c| match c {
            'S' => 1,
            _ => 0,
        })
        .collect::<Vec<u64>>();

    for line in lines.map(|line| line.chars().collect::<Vec<char>>()) {
        for i in 0usize..tachyons.len() {
            if line[i] == '^' {
                tachyons[i - 1] += tachyons[i];
                tachyons[i + 1] += tachyons[i];
                tachyons[i] = 0;
            }
        }
    }

    tachyons.into_iter().sum::<u64>()
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
