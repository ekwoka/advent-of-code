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
    let (ranges, ingredients) = input.split_once("\n\n").unwrap();
    let ranges = ranges
        .lines()
        .map(|line| {
            let (start, end) = line.split_once("-").unwrap();
            (start.parse::<u64>().unwrap(), end.parse::<u64>().unwrap())
        })
        .collect::<Vec<_>>();

    ingredients
        .lines()
        .map(|id| id.parse::<u64>().unwrap())
        .filter(|id| ranges.iter().any(|(start, end)| id >= start && id <= end))
        .count()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> u64 {
    let mut ranges = input
        .split("\n\n")
        .next()
        .unwrap()
        .lines()
        .map(|line| {
            let (start, end) = line.split_once("-").unwrap();
            (start.parse::<u64>().unwrap(), end.parse::<u64>().unwrap())
        })
        .collect::<Vec<_>>();
    ranges.sort_by_key(|(start, _)| *start);

    let mut previous_end = 0;
    ranges
        .into_iter()
        .map(|(start, end)| {
            if start <= previous_end {
                let start = previous_end + 1;
                if end > previous_end {
                    previous_end = end;
                    end - start + 1
                } else {
                    0
                }
            } else {
                previous_end = end;
                end - start + 1
            }
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
        let input = include_str!("../../node_modules/.aoc-cache/2025-05.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 712));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-05.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 332_998_283_036_769));
    }
}
