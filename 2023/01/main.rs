#!/usr/bin/env rust-script
use std::fs;

fn part_one(contents: &str) -> i32 {
  contents
        .lines()
        .map(|line| {
          let mut chars = line.chars().into_iter().filter(|ch| ch.is_numeric());
          let first = chars.next().unwrap_or('0');
          let last = chars.last().unwrap_or(first);
          format!("{}{}", first, last).parse::<i32>().expect("Should be able to parse to number")
        }
        ).sum::<i32>()
}

fn part_two(contents: &str) -> i32 {
  contents
        .lines()
        .map(|line| decode_number(line)
        ).sum::<i32>()
}

const NUMBER_PATTERNS: [&str;19] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
fn decode_number(str: &str) -> i32 {
    let mut contained_number_strings = NUMBER_PATTERNS.iter().flat_map(|pattern| [str.find(pattern).map(|idx| (idx, pattern)),str.rfind(pattern).map(|idx| (idx, pattern))]).filter_map(|ptrn| ptrn).collect::<Vec<_>>();
    contained_number_strings.sort_by(|(idx_a, _), (idx_b, _)| idx_a.cmp(idx_b));
    let mut contained_numbers = contained_number_strings.iter().map(|(_, pattern)| to_number_string(pattern));
    let first = contained_numbers.next().unwrap_or("0");
    let last = contained_numbers.last().unwrap_or(first);
    format!("{}{}", first, last).parse::<i32>().expect("Should be able to parse to number")
  }

fn to_number_string(str: &str) -> &str {
  match str {
    "one" => "1",
    "two" => "2",
    "three" => "3",
    "four" => "4",
    "five" => "5",
    "six" => "6",
    "seven" => "7",
    "eight" => "8",
    "nine" => "9",
    numeric => numeric
  }
}


fn main() {
  let input = fs::read_to_string("./utils/.cache/2023-1.txt").expect("Input should exist");
  println!("Part One Test: {}",part_one_example());
  println!("Part One: {}", part_one(&input));
  println!("Part Two Test: {}",part_two_example());
  println!("Part Two: {}", part_two(&input));
}

fn part_one_example()->i32 {
  let contents = "1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet";
  let outcome = part_one(contents);
  assert!(outcome == 142);
  outcome
}

fn part_two_example()->i32 {
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
