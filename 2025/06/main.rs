//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

use std::collections::VecDeque;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> u64 {
    let mut lines = input
        .trim()
        .lines()
        .map(|line| line.trim())
        .collect::<Vec<_>>()
        .into_iter()
        .rev();
    let operations = lines.next().unwrap().split_whitespace().collect::<Vec<_>>();
    let numbers = lines
        .map(|line| {
            line.split_whitespace()
                .map(|s| s.parse::<u64>().unwrap())
                .collect::<Vec<_>>()
        })
        .collect::<Vec<_>>();
    operations
        .into_iter()
        .enumerate()
        .map(|(i, op)| match op {
            "*" => numbers.iter().map(|n| n[i]).product(),
            "+" => numbers.iter().map(|n| n[i]).sum(),
            _ => 0,
        })
        .sum()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> u64 {
    let mut lines = input.trim().lines().collect::<Vec<_>>().into_iter().rev();
    let mut operations = lines.next().unwrap().chars().collect::<VecDeque<_>>();
    let mut numbers = lines
        .rev()
        .map(|line| line.chars().collect::<VecDeque<_>>())
        .collect::<Vec<_>>();

    let mut result: u64 = 0;
    while let Some(op) = operations.pop_front() {
        if op == ' ' {
            continue;
        }
        let numbers = (0..)
            .map(|_| {
                numbers
                    .iter_mut()
                    .map(|v| v.pop_front().unwrap_or(' '))
                    .collect::<String>()
            })
            .take_while(|s| !s.trim().is_empty())
            .map(|s: String| s.trim().parse::<u64>().unwrap_or_default())
            .collect::<Vec<u64>>();
        match op {
            '*' => result += numbers.into_iter().product::<u64>(),
            '+' => result += numbers.into_iter().sum::<u64>(),
            _ => {}
        }
    }
    result
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-06.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 4_309_240_495_780));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-06.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 9_170_286_552_289));
    }
}
