/**
 * --- Day 4:  ---
 * Part 1:
 * Part 2:
 */
use regex::Regex;
use std::os::raw::c_char;
use std::collections::HashMap;

#[no_mangle]
pub extern "C" fn part_one(cstring: *const c_char) -> i32 {
  let input: &str = unsafe {
        std::ffi::CStr::from_ptr(cstring).to_str().unwrap()
    };
    input
        .lines().map(|line| line.split(": ").last().unwrap().split(" | ").collect::<Vec<&str>>())
        .map(|card| {
          let number_regex = Regex::new(r"\d+").unwrap();
          let winning_numbers = number_regex.captures_iter(card[0]).map(|cap| cap[0].parse::<i32>().unwrap()).collect::<Vec<i32>>();
          number_regex.captures_iter(card[1]).map(|cap| cap[0].parse::<i32>().unwrap()).filter(|number| winning_numbers.contains(&number)).fold(0, |acc, number| {
              if acc == 0 {
                1
              } else {
                acc * 2
              }
          })
        }).sum()
}

#[no_mangle]
pub extern "C" fn part_two(cstring: *const c_char) -> i32 {
  let input: &str = unsafe {
        std::ffi::CStr::from_ptr(cstring).to_str().unwrap()
    };
    let card_map = input
        .lines().map(|line| line.split(": ").flat_map(|part| part.split(" | ")).collect::<Vec<&str>>())
        .map(|card| {
          let number_regex = Regex::new(r"(\d+)").unwrap();
          let card_id = number_regex.captures(card[0]).unwrap()[0].parse::<i32>().unwrap();
          let winning_numbers = number_regex.captures_iter(card[1]).map(|cap| cap[0].parse::<i32>().unwrap()).collect::<Vec<i32>>();
          let clone_cards = number_regex.captures_iter(card[2]).map(|cap| cap[0].parse::<i32>().unwrap()).filter(|number| winning_numbers.contains(&number)).scan(card_id.clone(), |id,_| { *id = *id + 1; Some(*id) }).collect::<Vec<i32>>();
          (card_id, clone_cards)
        }).collect::<HashMap<i32, Vec<i32>>>();

    fn process_cards(card_id: &i32, map: &HashMap<i32, Vec<i32>>) -> i32 {
      map.get(&card_id).unwrap().iter().map(|id| process_cards(id, map)).sum::<i32>() + 1
    }

    card_map.keys().map(|id| process_cards(id, &card_map)).sum()
}
