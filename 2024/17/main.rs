//! ```cargo
//! [dependencies]
//! ```
//! --- Day 17: Chronospatial Computer ---

#![feature(test, iter_map_windows)]
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn main() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn part_one(input: &str) -> String {
    let (register_init, program_data) = input.split_once("\n\n").unwrap();
    let mut registers = register_init
        .lines()
        .filter_map(|init| {
            init.split_whitespace()
                .last()
                .and_then(|v| v.parse::<usize>().ok())
        })
        .collect::<Vec<_>>();
    let program = program_data
        .split_whitespace()
        .last()
        .unwrap()
        .split(",")
        .filter_map(|code| code.parse::<usize>().ok())
        .collect::<Vec<_>>();
    let mut pointer = 0;
    let mut output = Vec::<String>::new();
    while let Some([code, operand]) = program.get(pointer..pointer + 2) {
        let op = OpCode::from(*code);
        match op {
            OpCode::Adv | OpCode::Bdv | OpCode::Cdv => {
                let divisor = 1
                    << match operand {
                        4..=6 => registers[operand - 4],
                        literal => *literal,
                    };

                match op {
                    OpCode::Adv => {
                        registers[0] /= divisor;
                    }
                    OpCode::Bdv => {
                        registers[1] = registers[0] / divisor;
                    }
                    OpCode::Cdv => {
                        registers[2] = registers[0] / divisor;
                    }
                    _ => todo!(),
                }
            }
            OpCode::Bxl | OpCode::Bxc => {
                let operand = match op {
                    OpCode::Bxl => *operand,
                    OpCode::Bxc => registers[2],
                    _ => todo!(),
                };
                registers[1] ^= operand;
            }
            OpCode::Bst => {
                let operand = match operand {
                    4..=6 => registers[operand - 4],
                    literal => *literal,
                };
                registers[1] = operand & 0b111;
            }
            OpCode::Jnz => {
                if registers[0] != 0 {
                    pointer = *operand;
                    continue;
                }
            }
            OpCode::Out => {
                let operand = match operand {
                    4..=6 => registers[operand - 4],
                    literal => *literal,
                };
                output.push(format!("{}", operand & 0b111));
            }
        }
        pointer += 2;
    }
    output.join(",")
}

#[wasm_bindgen]
pub fn part_two(input: &str) -> u64 {
    let (_register_init, program_data) = input.split_once("\n\n").unwrap();
    let program_data = program_data.split_whitespace().last().unwrap();
    let program = program_data
        .split(",")
        .filter_map(|code| code.parse::<usize>().ok())
        .collect::<Vec<_>>();
    let mut init = 1u64;
    loop {
        let mut registers: Vec<u64> = vec![init, 0, 0];
        let mut pointer = 0;
        let mut output = Vec::<usize>::new();
        while let Some([code, operand]) = program.get(pointer..pointer + 2) {
            let op = OpCode::from(*code);
            match op {
                OpCode::Adv | OpCode::Bdv | OpCode::Cdv => {
                    let divisor = 1
                        << match operand {
                            4..=6 => registers[operand - 4],
                            literal => *literal as u64,
                        };

                    match op {
                        OpCode::Adv => {
                            registers[0] /= divisor;
                        }
                        OpCode::Bdv => {
                            registers[1] = registers[0] / divisor;
                        }
                        OpCode::Cdv => {
                            registers[2] = registers[0] / divisor;
                        }
                        _ => todo!(),
                    }
                }
                OpCode::Bxl | OpCode::Bxc => {
                    let operand = match op {
                        OpCode::Bxl => *operand as u64,
                        OpCode::Bxc => registers[2],
                        _ => todo!(),
                    };
                    registers[1] ^= operand;
                }
                OpCode::Bst => {
                    let operand = match operand {
                        4..=6 => registers[operand - 4],
                        literal => *literal as u64,
                    };
                    registers[1] = operand & 0b111;
                }
                OpCode::Jnz => {
                    if registers[0] != 0 {
                        pointer = *operand;
                        continue;
                    }
                }
                OpCode::Out => {
                    let operand = match operand {
                        4..=6 => registers[operand - 4],
                        literal => *literal as u64,
                    };
                    output.push((operand & 0b111) as usize);
                }
            }
            pointer += 2;
        }
        if output
            .iter()
            .rev()
            .zip(program.iter().rev())
            .filter(|(a, b)| a == b)
            .count()
            == output.len()
        {
            if output.len() == program.len() {
                break;
            }
            init <<= 3;
            continue;
        }
        init += 1;
    }
    init
}

#[derive(Debug)]
enum OpCode {
    Adv,
    Bxl,
    Bst,
    Jnz,
    Bxc,
    Out,
    Bdv,
    Cdv,
}

impl From<usize> for OpCode {
    fn from(code: usize) -> Self {
        match code {
            0 => OpCode::Adv,
            1 => OpCode::Bxl,
            2 => OpCode::Bst,
            3 => OpCode::Jnz,
            4 => OpCode::Bxc,
            5 => OpCode::Out,
            6 => OpCode::Bdv,
            7 => OpCode::Cdv,
            _ => panic!(),
        }
    }
}

#[cfg(test)]
mod tests {
    extern crate test;
    use super::*;
    use test::Bencher;
    #[bench]
    fn part_one_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-17.txt").trim();
        b.iter(move || assert_eq!(part_one(input), "7,3,5,7,5,7,4,3,0"));
    }
    #[bench]
    fn part_two_bench(b: &mut Bencher) {
        let input = include_str!("../../node_modules/.aoc-cache/2024-17.txt").trim();
        b.iter(move || assert_eq!(part_two(input), 105_734_774_294_938));
    }
}
