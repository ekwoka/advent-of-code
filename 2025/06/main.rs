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
pub fn part_one(input: &str) -> u64 {
    let mut lines = input
        .trim()
        .lines()
        .map(|line| line.trim())
        .collect::<Vec<_>>();
    let operations = lines.pop().unwrap().split_whitespace().collect::<Vec<_>>();
    let numbers = lines
        .into_iter()
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
    let mut lines = input.lines().collect::<Vec<_>>();
    let line_length = input.lines().map(|line| line.len()).max().unwrap();
    let operations = lines.pop().unwrap();
    let mut numbers = lines
        .into_iter()
        .map(|line| line.chars())
        .collect::<Vec<_>>();

    let mut numbers = (0..=line_length)
        .map(|_| {
            numbers
                .iter_mut()
                .map(|v| v.next().unwrap_or(' '))
                .collect::<String>()
        })
        .map(|s: String| s.trim().parse::<u64>().unwrap_or_default())
        .split(0u64);

    operations
        .chars()
        .filter(|c| *c != ' ')
        .map(move |op| match op {
            '*' => numbers.next().unwrap().into_iter().product::<u64>(),
            '+' => numbers.next().unwrap().into_iter().sum::<u64>(),
            _ => 0,
        })
        .sum::<u64>()
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

trait Split<I: PartialEq, T> {
    fn split(self, split: I) -> SplitIterator<T, I>;
}

impl<I, T> Split<I, T> for T
where
    T: Iterator<Item = I>,
    I: PartialEq,
{
    fn split(self, split: I) -> SplitIterator<T, I> {
      SplitIterator::<T, I>::new(self, split)
    }
}

struct SplitIterator<I, T> {
    iter: I,
    split: T,
    _marker: std::marker::PhantomData<T>,
}

impl<I, T> SplitIterator<I, T> {
    fn new(iter: I, split: T) -> Self {
        SplitIterator::<I, T> {
            iter,
            split,
            _marker: std::marker::PhantomData,
        }
    }
}

impl<I, T> Iterator for SplitIterator<I, T>
where
    I: Iterator<Item = T>,
    T: PartialEq,
{
    type Item = Vec<T>;

    fn next(&mut self) -> Option<Self::Item> {
        let mut buffer = Vec::new();
        while let Some(item) = self.iter.next() && item != self.split {
            buffer.push(item);
        }
        Some(buffer)
    }
}
