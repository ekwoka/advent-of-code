//! ```cargo
//! [dependencies]
//! ```

#![feature(iter_array_chunks)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: String, size: usize) -> String {
    let mut data = input
        .chars()
        .filter(|ch| matches!(ch, '0' | '1'))
        .collect::<String>();
    loop {
        data = data.clone()
            + "0"
            + data
                .chars()
                .rev()
                .map(|ch| match ch {
                    '1' => '0',
                    '0' => '1',
                    _ => '0',
                })
                .collect::<String>()
                .as_str();
        if data.len() >= size {
            break;
        }
    }
    let mut data: Vec<char> = data.chars().take(size).collect();
    loop {
        data = data[..]
            .chunks(2)
            .map(|chs| match chs[0] == chs[1] {
                true => '1',
                false => '0',
            })
            .collect();
        if data.len() % 2 == 1 {
            break;
        }
    }
    data.iter().collect()
}

#[wasm_bindgen]
pub fn part_one_stream(input: String, size: usize) -> String {
    let mut data: Box<dyn Iterator<Item = usize>> = Box::new(generate_data_stream(input, size));
    let mut collapsed = size;
    while collapsed % 2 == 0 {
        data = Box::new(data.array_chunks::<2>().map(|chs| chs[0] ^ chs[1] ^ 1));
        collapsed /= 2;
    }
    data.map(|n| n.to_string()).collect()
}

fn generate_data_stream(input: String, size: usize) -> impl Iterator<Item = usize> {
    let input_len = input.len();

    (0..size).map(move |n| {
        let iteration = n / (input_len + 1);
        let char_pos = n % (input_len + 1);
        if iteration % 2 == 0 {
            if char_pos == input_len {
                (iteration / 2) % 2
            } else {
                input[char_pos..char_pos + 1].parse().unwrap()
            }
        } else if char_pos == input_len {
            let mut steps = 0;
            let mut m = iteration + 1;
            while m.ilog2() as f32 != (m as f32).log2() && m > 2 {
                m = 2_usize.pow(m.ilog2()) - (m - 2_usize.pow(m.ilog2()));
                steps += 1;
            }
            steps % 2
        } else {
            match input.chars().nth(input_len - char_pos - 1).unwrap() {
                '1' => 0,
                _ => 1,
            }
        }
    })
}
