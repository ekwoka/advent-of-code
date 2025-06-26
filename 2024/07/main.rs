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
    input
        .lines()
        .filter_map(|lines| lines.split_once(": "))
        .filter(|(test, values)| {
            let test = test.parse::<u64>().unwrap();
            let nums = values
                .split_whitespace()
                .filter_map(|n| n.parse::<u64>().ok())
                .collect::<Vec<_>>();
            (0..1 << (nums.len() - 1))
                .map(|mask| {
                    let mut result = 0u64;
                    for (idx, num) in nums.iter().enumerate() {
                        if idx == 0 {
                            result += num;
                        } else {
                            match mask & (1 << (idx - 1)) {
                                0 => result += num,
                                _ => result *= num,
                            };
                        }
                    }
                    result
                })
                .any(|result| result == test)
        })
        .filter_map(|(test, _)| test.parse::<u64>().ok())
        .sum()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> u64 {
    let mut output = 0;
    for (test, values) in input.lines().filter_map(|lines| lines.split_once(": ")) {
        let test = test.parse::<u64>().unwrap();
        let mut nums = values
            .split_whitespace()
            .filter_map(|n| n.parse::<u64>().ok())
            .rev()
            .collect::<Vec<_>>();

        let mut stack = vec![(nums.pop().unwrap(), nums.clone())];
        while let Some((value, mut remaining)) = stack.pop() {
            if value > test {
                continue;
            } else if let Some(next) = remaining.pop() {
                stack.push((
                    format!("{value}{next}").parse::<u64>().unwrap(),
                    remaining.clone(),
                ));
                stack.push((value + next, remaining.clone()));
                stack.push((value * next, remaining.clone()));
            } else if value == test {
                output += test;
                break;
            }
        }
    }
    output
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-07.txt").trim();
        b.iter(move || part_one(input));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-07.txt").trim();
        b.iter(move || part_two(input));
    }
}
