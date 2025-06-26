//! ```cargo
//! [dependencies]
//! ```
//! --- Day 11: Plutonian Pebbles ---
//! Part    Time       Rank
//!   1     00:11:24   2787
//!   2     00:36:36   3000
//!
//! One Pluto we need to count some crazy plutonian stones
//! They have numbers and every time we blink they change
//! Under some cases, they duplicate into more stones
//! We need to predict the number of stones
#![feature(test)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}

/// Here we take a stone as input, handle any splits or number changes, and recurse
/// This memoizes values, since many will repeat a lot (especially 0)
fn expand(stone: &str, blinks: usize, map: &mut std::collections::HashMap<String, u64>) -> u64 {
    let key = format!("{stone}-{blinks}");
    if map.contains_key(&key) {
        return map.get(&key).unwrap().to_owned();
    }
    let count = match blinks {
        0 => 1u64,
        _ => {
            if stone == "0" || stone.is_empty() {
                expand("1", blinks - 1, map)
            } else {
                match stone.len() & 1 {
                    0 => {
                        expand(&stone[0..stone.len() / 2], blinks - 1, map)
                            + expand(
                                stone[stone.len() / 2..].trim_start_matches("0"),
                                blinks - 1,
                                map,
                            )
                    }
                    _ => expand(
                        format!("{}", stone.parse::<u64>().unwrap() * 2024).as_str(),
                        blinks - 1,
                        map,
                    ),
                }
            }
        }
    };
    map.insert(key, count);
    count
}

/// There is only 1 Part in the code, as Part one and Part two are the same
/// But with Part 2's blink count being much much higher.
/// That is what necessitated a recursive memoized approach.
#[wasm_bindgen]
pub fn part_one(input: &str, blinks: usize) -> u64 {
    let mut memoized = std::collections::HashMap::<String, u64>::new();
    input
        .split_whitespace()
        .map(|stone| expand(stone, blinks, &mut memoized))
        .sum()
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-11.txt").trim();
        b.iter(move || part_one(input, 25));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-11.txt").trim();
        b.iter(move || part_one(input, 75));
    }
}
