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
pub fn part_one(input: &str) -> u64 {
    input
        .split(',')
        .filter_map(|range| range.split_once('-'))
        .flat_map(|(start, end)| {
            let start = start.parse::<u64>().unwrap();
            let end = end.parse::<u64>().unwrap();
            start..=end
        })
        .filter(|id| {
            let string_id = id.to_string();
            if string_id.len() % 2 == 0 {
                let (first, second) = string_id.split_at(string_id.len() / 2);
                first == second
            } else {
                false
            }
        })
        .sum()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> u64 {
    input
        .split(',')
        .filter_map(|range| range.split_once('-'))
        .flat_map(|(start, end)| {
            let start = start.parse::<u64>().unwrap();
            let end = end.parse::<u64>().unwrap();
            start..=end
        })
        .filter(|id| {
            let string_id = id.to_string();
            (1..(string_id.len())).any(|i| {
                if (string_id.len() % i) == 0 {
                    string_id[0..i].repeat(string_id.len() / i) == string_id
                } else {
                    false
                }
            })
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
        let input = include_str!("../../node_modules/.aoc-cache/2025-02.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 23_560_874_270));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-02.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 44_143_124_633));
    }
}
