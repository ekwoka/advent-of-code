#!/usr/bin/env rust-script
use std::fs;

let contents = fs::read_to_string("input.txt").expect("Something went wrong reading the file");
let mut elves = contents
    .split("\n\n")
    .map(|elf|
        elf
            .lines()
            .map(|line| line.parse::<i32>().unwrap())
            .sum()
    )
    .collect::<Vec<i32>>();
elves.sort();
let sorted = elves.into_iter().rev().collect::<Vec<i32>>();

println!("Part 1: {:?}", sorted.first().expect("No elves found"));
println!(
    "Part 2: {:?}",
    sorted
        .get(0..3)
        .expect("Not enough elves found")
        .into_iter()
        .sum::<i32>()
);