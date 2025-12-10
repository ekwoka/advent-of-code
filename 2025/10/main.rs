//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

#[path = "../../utils/main.rs"]
mod utils;

use regex::Regex;
use utils::*;
use wasm_bindgen::prelude::*;
use web_sys::console;
// use std::collections::HashMap;
// use std::collections::HashSet;
use std::collections::VecDeque;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
    let light_regex = Regex::new(r#"\[(.*?)\]"#).unwrap();
    let button_regex = Regex::new(r#"\((.*?)\)"#).unwrap();
    input
        .lines()
        .map(|line| {
            let lights = light_regex
                .captures(line)
                .unwrap()
                .get(1)
                .unwrap()
                .as_str()
                .chars()
                .map(|c| match c {
                    '#' => 1u8,
                    _ => 0u8,
                })
                .collect::<Vec<u8>>();
            let buttons = button_regex
                .captures_iter(line)
                .map(|c| {
                    let nums = c.get(1).unwrap().as_str();
                    nums.split(',')
                        .map(|d| d.parse::<usize>().unwrap())
                        .collect::<Vec<usize>>()
                })
                .collect::<Vec<Vec<usize>>>();
            let mut queue = VecDeque::from([(
                lights.iter().map(|_| 0).collect::<Vec<u8>>(),
                usize::MAX,
                0usize,
            )]);
            while let Some((state, prev, count)) = queue.pop_front() {
                if state == lights {
                    return count;
                }
                for (i, button) in buttons.iter().enumerate() {
                    if i == prev {
                        continue;
                    }
                    let mut new_state = state.clone();
                    for &pos in button {
                        new_state[pos] ^= 1;
                    }
                    queue.push_back((new_state, i, count + 1));
                }
            }
            return 0;
        })
        .sum()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> u64 {
    let joltage_regex = Regex::new(r#"\{(.*?)\}"#).unwrap();
    let button_regex = Regex::new(r#"\((.*?)\)"#).unwrap();
    input
        .lines()
        .map(|line| {
            let joltages = joltage_regex
                .captures(line)
                .unwrap()
                .get(1)
                .unwrap()
                .as_str()
                .split(',')
                .map(|d| d.parse::<usize>().unwrap())
                .collect::<Vec<usize>>();
            let mut buttons = button_regex
                .captures_iter(line)
                .map(|c| {
                    let nums = c.get(1).unwrap().as_str();
                    nums.split(',')
                        .map(|d| d.parse::<usize>().unwrap())
                        .collect::<Vec<usize>>()
                })
                .collect::<Vec<Vec<usize>>>();
            buttons.sort_by_key(|button| button.iter().sum::<usize>());
            let mut queue = VecDeque::from([(
                joltages.iter().map(|_| 0).collect::<Vec<usize>>(),
                usize::MAX,
                0u64,
            )]);
            while let Some((state, prev, count)) = queue.pop_back() {
                if state == joltages {
                    return count;
                }
                if state.iter().zip(joltages.iter()).any(|(a, b)| a > b) {
                    continue;
                }
                for (i, button) in buttons.iter().enumerate() {
                    if i == prev {
                        continue;
                    }
                    let mut new_state = state.clone();
                    for &pos in button {
                        new_state[pos] += 1;
                    }
                    if new_state.iter().zip(joltages.iter()).any(|(a, b)| a > b) {
                        continue;
                    }
                    queue.push_back((new_state, i, count + 1));
                }
            }
            return 0u64;
        })
        .inspect(|presses| console::log_1(&format!("Presses: {}", presses).into()))
        .sum()
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-10.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 432));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-10.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 0));
    }
}
