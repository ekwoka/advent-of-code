#!/usr/bin/env rust-script
use std::fs;

fn isolate_number(line: String) -> i32 {
    let mut chars = line.chars().filter(|ch| ch.is_numeric());
    let first = chars.next().unwrap_or('0');
    let last = chars.last().unwrap_or(first);
    format!("{}{}", first, last)
        .parse::<i32>()
        .expect("Should be able to parse to number")
}
fn part_one(contents: &str) -> i32 {
    contents
        .lines()
        .map(String::from)
        .map(isolate_number)
        .sum::<i32>()
}

const NUMBER_PATTERNS: [&str; 10] = [
    "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
];
fn swap_number_strings(str: &str) -> String {
    NUMBER_PATTERNS
        .iter()
        .enumerate()
        .fold(String::from(str), |acc, (idx, word)| {
            acc.replace(
                word,
                format!(
                    "{}{}{}",
                    word.chars().next().unwrap(),
                    &idx.to_string(),
                    word.chars().last().unwrap()
                )
                .as_str(),
            )
        })
}

fn part_two(contents: &str) -> i32 {
    contents
        .lines()
        .map(swap_number_strings)
        .map(isolate_number)
        .sum::<i32>()
}

fn main() {
    let input = fs::read_to_string("./utils/.cache/2023-1.txt").expect("Input should exist");
    println!("Part One Test: {}", part_one_example());
    println!("Part One: {}", part_one(&input));
    println!("Part Two Test: {}", part_two_example());
    println!("Part Two: {}", part_two(&input));
}

fn part_one_example() -> i32 {
    let contents = "1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet";
    let outcome = part_one(contents);
    assert!(outcome == 142);
    outcome
}

fn part_two_example() -> i32 {
    let contents = "two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen";
    let outcome = part_two(contents);
    assert!(outcome == 281);
    outcome
}
