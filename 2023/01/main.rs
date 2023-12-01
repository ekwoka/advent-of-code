#!/usr/bin/env rust-script
/**
 * --- Day 1: Trebuchet?! ---
 * Part 1: 00:46:00  12041
 * Part 2: 01:32:38   9502
 * A fairly simple problem to start with. Most of my issues (on top of starting late) were from lack of familiarity with Rust.
 * Things got especially messy in part two when the logic wasn't quite as simple
 */
use std::fs;

/*
 * Part One:
 * We need to find the numbers hidden within the strings, and sum them together.
 * In this part, we only need to find real digits (1-9, no 0), take the first and the last, put them together as the two digits of a single number, and sum them.
 */

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

/*
 * Part Two:
 * Here we discover that the strings also contain the spelled out words of numbers, and these need to also be handled!
 * It's still find the first and last, but now those can be words or digits.
 * My first method that solved it involved looping through all the words and finding the first and last indexes of those words, then sorting those by index and taking the first and last.
 * This is a cleaned up version that replaces the words with digits (preservering the characters since there are words like "one" and "two" that share characters)
 * Then from there it's the same as part one.
 */

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

/* Tests to assert the code works for the sample code */
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
