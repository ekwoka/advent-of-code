import { input, folds } from './input.mjs'

// const input = ['6,10','0,14','9,10','0,3','10,4','4,11','6,0','6,12','4,1','0,13','10,12','3,4','3,0','8,4','1,10','2,14','8,10','9,0']

// const folds = ['fold along y=7','fold along x=5']

const points = input.map(string => ([...string.split(',')]))

let [height, width] = [Math.max(...points.map(([x, y]) => parseInt(y)))+1, Math.max(...points.map(([x, y]) => parseInt(x)))+1]

height = height % 2 ? height : height + 1
width = width % 2 ? width : width + 1

let grid = Array.from(Array(height).values()).map(row => Array(width).fill('.'))

points.forEach(([x, y]) => grid[y][x] = '#')

function fold(grid, folds) {
    let newGrid = grid.map(row => [...row])
    return folds.reduce((foldedArray, instruction) => {
        let [direction, value] = instruction.split(' ').at(-1).split('=')
        value = parseInt(value)
        let [firstHalf, secondHalf] = direction=='y' ? [foldedArray.slice(0, value), foldedArray.slice(value+1)] : foldedArray.reduce((output, row) => {
            output[0].push(row.slice(0, value))
            output[1].push(row.slice(value+1))
            return output
        },[[],[]])
        secondHalf = direction=='y' ? secondHalf.reverse() : secondHalf.map(row => row.reverse())
        return foldedArray = firstHalf.map((row, y) => row.map((cell, x) => {
            return (cell == '#' || secondHalf[y][x] == '#')?'#':'.'
        }))
    },newGrid)
}

function foldAndCount(grid, folds, foldCount) {
    console.log('Folds to Perform:', foldCount)
    let endGrid = fold(grid, folds.slice(0,foldCount||folds.length))
    return endGrid.reduce((count, row) => {
        return count + row.reduce((dots, cell) => {
            if (cell === '#') dots++
            return dots
        },0)
    },0)
}

// Task 1: Count '#' after 1 fold
console.log('Task1:', foldAndCount(grid, folds, 1))

// Task 2: Get Letters from output
console.log('Task2:', fold(grid, folds).map(row => row.join('')))