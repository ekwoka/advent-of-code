//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

use wasm_bindgen::prelude::*;
// use regex::regex;
// use web_sys::console;
// use std::collections::HashMap;
// use std::collections::HashSet;
// use std::collections::VecDeque;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
    input
        .lines()
        .map(|line| {
            let max = line
                .chars()
                .take(line.len() - 1)
                .map(|c| c.to_digit(10).unwrap_or_default())
                .max()
                .unwrap_or_default();
            let index = line
                .chars()
                .position(|c| c.to_string() == max.to_string())
                .unwrap();
            let next_max = line[index + 1..]
                .chars()
                .map(|c| c.to_digit(10).unwrap_or_default())
                .max()
                .unwrap_or_default();
            max * 10 + next_max
        })
        .sum::<u32>() as usize
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> u64 {
    input
        .lines()
        .map(|line| {
            let mut max = Vec::<u64>::new();
            let mut index = 0;
            for i in (0..12).rev() {
                max.push(
                    line[index..line.len() - i]
                        .chars()
                        .map(|c| c.to_digit(10).unwrap_or_default() as u64)
                        .max()
                        .unwrap_or_default(),
                );
                index = index
                    + line[index..]
                        .chars()
                        .position(|c| c.to_string() == max.last().unwrap().to_string())
                        .unwrap()
                    + 1;
            }
            max.iter().fold(0, |acc, &num| acc * 10 + num)
        })
        .sum()
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-03.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 17142));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-03.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 0));
    }
}
