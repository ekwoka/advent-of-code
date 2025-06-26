//! ```cargo
//! [dependencies]
//! ```
//! --- Day 19: Linen Layout ---
#![feature(test)]
use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
    let (towels, patterns) = input.split_once("\n\n").unwrap();
    let towels = towels.split(", ").collect::<Vec<_>>();
    patterns
        .lines()
        .filter(|pattern| {
            let mut queue = vec![*pattern];
            while let Some(remaining) = queue.pop() {
                if remaining.is_empty() {
                    return true;
                }
                towels
                    .iter()
                    .filter_map(|towel| remaining.strip_prefix(towel))
                    .for_each(|remaining| queue.push(remaining));
            }
            false
        })
        .count()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> u64 {
    let (towels, patterns) = input.split_once("\n\n").unwrap();
    let towels = towels.split(", ").collect::<Vec<_>>();
    let mut cache = HashMap::<String, u64>::new();
    patterns
        .lines()
        .map(|pattern| is_possible(pattern, &towels, &mut cache))
        .sum()
}

fn is_possible(remaining: &str, towels: &Vec<&str>, cache: &mut HashMap<String, u64>) -> u64 {
    if remaining.is_empty() {
        return 1;
    }
    if cache.contains_key(remaining) {
        let possible = cache.get(remaining).unwrap();
        return *possible;
    }
    let possible_count = towels
        .iter()
        .filter_map(|towel| remaining.strip_prefix(*towel))
        .map(|remaining| is_possible(remaining, towels, cache))
        .sum();
    cache.insert(remaining.to_string(), possible_count);
    possible_count
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-19.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 242));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-19.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 595_975_512_785_325));
    }
}
