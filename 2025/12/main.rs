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
    let mut chunks = input.split("\n\n").collect::<Vec<_>>();
    let trees = chunks.pop().unwrap();

    let presents = chunks
        .into_iter()
        .map(|chunk| {
            chunk
                .lines()
                .skip(1)
                .flat_map(|line| line.chars().filter(|c| *c == '#'))
                .count()
        })
        .collect::<Vec<_>>();

    trees
        .lines()
        .filter(|line| {
            let (size, counts) = line.split_once(": ").unwrap();
            let size = size
                .split('x')
                .filter_map(|s| s.parse::<usize>().ok())
                .collect::<Vec<_>>();
            let counts = counts
                .split(' ')
                .filter_map(|s| s.parse::<usize>().ok())
                .collect::<Vec<_>>();

            if counts.iter().sum::<usize>() <= size.iter().map(|x| x / 9).product() {
                true
            } else if counts
                .iter()
                .zip(presents.iter())
                .map(|(a, b)| a * b)
                .sum::<usize>()
                > size.iter().product()
            {
                false
            } else {
                true
            }
        })
        .count()
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-12.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 472));
    }
}
