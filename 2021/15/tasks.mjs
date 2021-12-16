// Pathfinding algorithm. This works great for the small sample data, and even somewhat okay for the task 1 version, but it's awful at the task 2 version of this challenge. Please refer to 'prioritytasks.mjs' for the priority queue version.

// import input from './input.mjs'

const input = ['1163751742','1381373672','2136511328','3694931569','7463417111','1319128137','1359912421','3125421639','1293138521','2311944581']


const GRID = input.map((row, y) => row.split('').map(Number))

const OFFSETS = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0]
]

const START = [0, 0]
const startValue = 0 - GRID[0][0]

function task1(grid, height, width) {
    [height, width] = [height || grid.length, width || grid[0].length]
    console.log(height, width)
    let queue = [[...START, startValue]]
    let costs = Array.from(Array(height), () => Array(width).fill(undefined));
    let maxQ = queue.length
    let operations = 0;
    while (queue.length) {
        if (operations % 10000===0) {
            maxQ = Math.max(maxQ, queue.length)
            console.clear()
            console.log('Percentage Complete:',(1000-Math.floor((queue.length/maxQ)*1000))/10,'% of',operations+maxQ)
            console.log('Remaining Operations:', queue.length)
        }
        let [x, y, sum] = queue.shift()

        let adjustment = Math.floor(x/grid[0].length) + Math.floor(y/grid.length)
        let cell = grid[y%grid.length][x%grid[0].length]+adjustment
        cell = cell > 9 ? cell - 9 : cell
        operations++;
        let newSum = sum + cell
        if (!costs[y][x] || newSum < costs[y][x]) {
            costs[y][x] = newSum
            OFFSETS.forEach(([dx, dy]) => {
                let newX = x + dx
                let newY = y + dy
                if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                    queue.push([newX, newY, newSum])
                }
            })
        }
    }
    console.clear()
    console.log('Percentage Complete: 100%')
    console.log('Total Operations:', operations)
    console.log('Max Q:', maxQ)


    return costs.at(-1).at(-1)
}


console.log(task1(GRID, GRID.length*5, GRID[0].length*5))