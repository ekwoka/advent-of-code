#!/usr/bin/env rust-script
use std::fs;

fn part_one(rounds: Vec<(i32, i32)>) -> Result<i32, String> {
  let scores = rounds.iter().fold(0, |sum, round| {
    let result: i32 = (round.0 - round.1 + 3) % 3;
    let bonus = match result {
      0 => 3,
      1 => 0,
      2 => 6,
      _ => 0,
    };
    sum + bonus + round.1
  });
  Ok(scores)
}

fn part_two(rounds: Vec<(i32, i32)>) -> Result<i32, String> {
  let scores = rounds.iter().fold(0, |sum, round| {
    let result_score: i32 = (round.1 - 1) * 3;
    let sign_score = ((round.0 + 2 + (round.1 - 2)) % 3) + 1;
    sum + result_score + sign_score
  });
  Ok(scores)
}

fn type_to_score(ch: &char) -> i32 {
  match ch {
    'A' | 'X' => 1,
    'B' | 'Y' => 2,
    'C' | 'Z' => 3,
    _ => 0,
  }
}

fn main() -> Result<(), String> {
  let contents = fs::read_to_string("input.txt").map_err(|_| "No file")?;

  let rounds: Vec<(i32, i32)> = contents
    .lines()
    .map(|line| {
      let mut chars = line.trim().chars();
      let first = type_to_score(&chars.next().unwrap());
      chars.next();
      let second = type_to_score(&chars.next().unwrap());
      (first, second)
    })
    .collect();
  println!("Part one: {}", part_one(rounds.clone())?);
  println!("Part two: {}", part_two(rounds)?);
  Ok(())
}