// Calculate which position between the two numbers has the least amount of fuel required to reach it

import input from './input.mjs'

// const input = [16,1,2,0,4,2,7,1,2,14]

// Task 1 has 1 fuel cost per slot

function task1(input) {
    const max = Math.max(...input)
    const min = Math.min(...input)
    let positions = Array.from(Array(max+1).keys()).slice(min)
    let fuelCost = positions.reduce((cheapest,target) => {
        let cost = input.reduce((fuel, pos) => {
            return Math.abs(pos - target) + fuel
        }, 0)
        cost
        if (cost < cheapest[1]) return [target, cost]
        return cheapest
    },[-1, Infinity]);
    return fuelCost
}

// Task 2 has an increasing fuel cost per slot, essentially !n (n * (n+1))/2

function task2(input) {
    const max = Math.max(...input)
    const min = Math.min(...input)
    let positions = Array.from(Array(max+1).keys()).slice(min)
    let fuelCost = positions.reduce((cheapest,target) => {
        let cost = input.reduce((fuel, pos) => {
            let diff = Math.abs(pos - target)
            return fuel + (diff * (diff+1))/2
        }, 0)
        cost
        if (cost < cheapest[1]) return [target, cost]
        return cheapest
    },[-1, Infinity]);
    return fuelCost
}


console.time('task1')
console.log('Task 1:', task1(input));
console.timeEnd('task1')

console.time('task2')
console.log('Task 2:', task2(input));
console.timeEnd('task2')