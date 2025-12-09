//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

use std::collections::HashSet;
use wasm_bindgen::prelude::*;

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
            let pow_10_start = (start as f64).log10().floor() as u32;
            let pow_10_end = (end as f64).log10().floor() as u32;
            (pow_10_start..=pow_10_end)
                .filter(|&pow_10| pow_10 % 2 == 1)
                .flat_map(move |pow_10| {
                    let multiplier = 10u64.pow((pow_10 + 1) / 2) + 1;
                    (start.div_ceil(multiplier)..=end.min(10u64.pow(pow_10 + 1) - 1) / multiplier)
                        .map(move |id| id * multiplier.clone())
                })
        })
        .filter(|id| id.to_string().len() % 2 == 0)
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

            let pow_10_start = (start as f64).log10().floor() as u32;
            let pow_10_end = (end as f64).log10().floor() as u32;
            (pow_10_start..=pow_10_end).flat_map(move |pow_10| {
                (1..=(pow_10 + 1) / 2)
                    .filter(move |adjustment| (pow_10 + 1) % adjustment == 0)
                    .flat_map(move |adjustment| {
                        let multiplier = format!("{}1", "0".repeat(adjustment as usize - 1))
                            .repeat(((pow_10 + 1) / adjustment) as usize)
                            .parse::<u64>()
                            .unwrap();
                        (start.max(10u64.pow(pow_10)).div_ceil(multiplier)
                            ..=end.min(10u64.pow(pow_10 + 1) - 1) / multiplier)
                            .map(move |id| id * multiplier.clone())
                    })
            })
        })
        .collect::<HashSet<_>>()
        .into_iter()
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
