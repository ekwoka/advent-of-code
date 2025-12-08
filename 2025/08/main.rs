//! ```cargo
//! [dependencies]
//! ```
#![feature(test)]

#[path = "../../utils/main.rs"]
mod utils;

use std::collections::HashSet;
use utils::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str, links: i32) -> usize {
    let generators = input
        .lines()
        .map(|line| {
            let mut parts = line.split(',');
            let x = parts.next().unwrap().parse().unwrap();
            let y = parts.next().unwrap().parse().unwrap();
            let z = parts.next().unwrap().parse().unwrap();
            Vec3::new(x, y, z)
        })
        .collect::<Vec<_>>();
    let mut pairs = generators
        .iter()
        .enumerate()
        .flat_map(|(i, a)| {
            generators
                .iter()
                .skip(i + 1)
                .map(|b| (a.clone(), b.clone()))
        })
        .map(|(a, b)| (a, b, (a - b).length()))
        .collect::<Vec<_>>();
    pairs.sort_by(|(_, _, a), (_, _, b)| a.partial_cmp(b).unwrap());
    let mut chains: Vec<HashSet<Vec3>> = Vec::new();

    for (a, b, _) in pairs.into_iter().take(links as usize) {
        let mut contained_chains = chains
            .iter_mut()
            .filter(|chain| chain.contains(&a) || chain.contains(&b))
            .take(2);
        let chain_a = contained_chains.next();
        let chain_b = contained_chains.next();
        if let Some(chain_a) = chain_a {
            if let Some(chain_b) = chain_b {
                *chain_a = chain_a.union(chain_b).cloned().collect();
                chain_b.clear();
            } else {
                if chain_a.contains(&a) && chain_a.contains(&b) {
                    continue;
                } else if chain_a.contains(&a) {
                    chain_a.insert(b);
                } else if chain_a.contains(&b) {
                    chain_a.insert(a);
                }
            }
        } else {
            chains.push(HashSet::from([a, b]));
        }
    }

    chains.sort_by(|a, b| b.len().cmp(&a.len()));
    chains
        .into_iter()
        .map(|chain| chain.len())
        .take(3)
        .product()
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> u64 {
    let generators = input
        .lines()
        .map(|line| {
            let mut parts = line.split(',');
            let x = parts.next().unwrap().parse().unwrap();
            let y = parts.next().unwrap().parse().unwrap();
            let z = parts.next().unwrap().parse().unwrap();
            Vec3::new(x, y, z)
        })
        .collect::<Vec<_>>();
    let mut pairs = generators
        .iter()
        .enumerate()
        .flat_map(|(i, a)| {
            generators
                .iter()
                .skip(i + 1)
                .map(|b| (a.clone(), b.clone()))
        })
        .map(|(a, b)| (a, b, (a - b).length()))
        .collect::<Vec<_>>();
    pairs.sort_by(|(_, _, a), (_, _, b)| a.partial_cmp(b).unwrap());
    let mut chains: Vec<HashSet<Vec3>> = Vec::new();

    for (a, b, _) in pairs.into_iter() {
        let mut contained_chains = chains
            .iter_mut()
            .filter(|chain| chain.contains(&a) || chain.contains(&b))
            .take(2);
        let chain_a = contained_chains.next();
        let chain_b = contained_chains.next();
        if let Some(chain_a) = chain_a {
            if let Some(chain_b) = chain_b {
                *chain_a = chain_a.union(chain_b).cloned().collect();
                chain_b.clear();
            } else {
                if chain_a.contains(&a) && chain_a.contains(&b) {
                    continue;
                } else if chain_a.contains(&a) {
                    chain_a.insert(b);
                } else if chain_a.contains(&b) {
                    chain_a.insert(a);
                }
            }
            if chain_a.len() == generators.len() {
                return (a.x as u64 * b.x as u64) as u64;
            }
        } else {
            chains.push(HashSet::from([a, b]));
        }
    }

    0
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-08.txt").trim();
        b.iter(move || assert_eq!(part_one(input, 1000), 81_536));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2025-08.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 7_017_750_530));
    }
}
