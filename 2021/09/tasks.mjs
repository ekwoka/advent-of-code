// Floodfilling.

import input from './input.mjs'

// const input = [2199943210,3987894921,9856789892,8767896789,9899965678]

const map = input.map(x => [...x.toString()])

// Task 1 identifies lowest poiints, and adds their score together

function task1(map) {
    const lowestPoints = map.flatMap((row, y) => {
        return row.filter((cell, x) => {
            let offsets = [
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, 0]
            ]
            return offsets.every(offset => {
                let x2 = x + offset[0]
                let y2 = y + offset[1]
                if (x2 < 0 || y2 < 0 || x2 >= map[0].length || y2 >= map.length) {
                    return true
                }
                return map[y2][x2] > cell
            })
        })
    })
    return lowestPoints.reduce((acc, point) => acc + 1 + parseInt(point), 0)
}

console.log(task1(map))

// task 2 finds the lowest points, and then backfills them up to points at height 9 and determines the size of the area

function task2(map) {
    const mapObjects = objectifyMap(map)
    const lowestPoints = findLowestPoints(mapObjects)
    const basins = lowestPoints.map(point => {
        return flood(mapObjects, ...point)
    })
    const largestBasins = basins.sort((a, b) => b - a).slice(0, 3)
    
    displayMap(mapObjects)
    return largestBasins.reduce((acc, basin) => acc * basin)
}

function objectifyMap(map) {
    return map.map((row, y) => {
        return row.map((cell, x) => {
            return {
                height: cell,
                filled: false
            }
        })
    })
}

function findLowestPoints(map) {
    const lowestPoints = map.flatMap((row, y) => {
        return row.reduce((acc,cell, x) => {
            let offsets = [
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, 0]
            ]
            return offsets.every(offset => {
                let x2 = x + offset[0]
                let y2 = y + offset[1]
                if (x2 < 0 || y2 < 0 || x2 >= map[0].length || y2 >= map.length) {
                    return true
                }
                return map[y2][x2].height > cell.height
            })? [...acc, [y, x]] : acc
        },[])
    })
    return lowestPoints
}

function flood(map, y, x) {
    if (map[y][x].filled) return 0
    if (map[y][x].height >= 9) return 0
    map[y][x].filled = true
    let offsets = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
    ]
    return offsets.reduce((acc, offset) => {
        let x2 = x + offset[0]
        let y2 = y + offset[1]
        if (x2 < 0 || y2 < 0 || x2 >= map[0].length || y2 >= map.length) {
            return acc
        }
        return acc + flood(map, y2, x2)
    }, 1)
}

function displayMap(map) {
    let string = '\n\n'
    map.forEach(row => {
        row.forEach(cell => {
            if (cell.filled) {
                string += '\x1b[34m#\x1b[89m'
            } else {
                string += `\x1b[97m${cell.height}\x1b[39m`
            }
        })
        string += '\n'
    })
    console.clear()
    console.log(string)
}

console.time('task2')
console.log(task2(map))
console.timeEnd('task2')