//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

use std::collections::HashMap;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> usize {
    let graph: HashMap<String, Vec<String>> = input
        .lines()
        .map(|line| {
            let (id, outputs) = line.split_once(": ").unwrap();
            let outputs = outputs
                .split_whitespace()
                .map(|output| output.to_string())
                .collect();
            (id.to_string(), outputs)
        })
        .collect();
    let mut stack = vec!["you".to_string()];

    let mut count = 0;
    while let Some(node) = stack.pop() {
        if node == "out" {
            count += 1;
            continue;
        }
        if let Some(children) = graph.get(&node) {
            children.iter().cloned().for_each(|child| stack.push(child));
        }
    }
    count
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> u64 {
    let graph: HashMap<&str, Vec<&str>> = input
        .lines()
        .map(|line| {
            let (id, outputs) = line.split_once(": ").unwrap();
            let outputs = outputs.split_whitespace().map(|output| output).collect();
            (id, outputs)
        })
        .collect();

    fn get_paths(graph: &HashMap<&str, Vec<&str>>, start: &str, end: &str) -> u64 {
        let mut cache = HashMap::<&str, u64>::new();

        fn get_path<'a>(
            graph: &HashMap<&str, Vec<&'a str>>,
            next: &'a str,
            end: &str,
            cache: &mut HashMap<&'a str, u64>,
        ) -> u64 {
            if next == end {
                1
            } else if next == "out" {
                0
            } else if let Some(&count) = cache.get(next) {
                count
            } else {
                let count = graph
                    .get(next)
                    .unwrap()
                    .iter()
                    .map(|child| get_path(graph, child, end, cache))
                    .sum::<u64>();
                cache.insert(next, count);
                count
            }
        }
        get_path(graph, start, end, &mut cache)
    }

    get_paths(&graph, "svr", "fft")
        * get_paths(&graph, "fft", "dac")
        * get_paths(&graph, "dac", "out")
        + get_paths(&graph, "svr", "dac")
            * get_paths(&graph, "dac", "fft")
            * get_paths(&graph, "fft", "out")
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-11.txt").trim();
        b.iter(move || assert_eq!(part_one(input), 543));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-11.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 479_511_112_939_968));
    }
}
