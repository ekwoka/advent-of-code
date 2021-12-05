// Map dangerous gas vents! In a 1000x1000 grid, identify hot spots of dangerous gas vents.

// sample data
// const input = [[[0,9],[5,9]],[[8,0],[0,8]],[[9,4],[3,4]],[[2,2],[2,1]],[[7,0],[7,4]],[[6,4],[2,0]],[[0,9],[2,9]],[[3,4],[1,4]],[[0,0],[8,8]],[[5,5],[8,2]]]

// puzzle input
import input from './input.mjs'

// only consider straight lines
function task1(input) {
    const map = Array.from(Array(1000).keys()).map(x => Array.from(Array(1000).keys()).fill(0))
    const filteredInput = filterOutDiagonals(input)
    filteredInput.forEach(pair => mapPointsBetween(...pair, map))
    return map.reduce((acc, row) => acc + row.reduce((acc, point) => acc + (point > 1 ? 1 : 0), 0), 0)
}

// consider diagonals
function task2(input) {
    const map = Array.from(Array(1000).keys()).map(x => Array.from(Array(1000).keys()).fill(0))
    input.forEach(pair => mapPointsBetween(...pair, map))
    return map.reduce((acc, row) => acc + row.reduce((acc, point) => acc + (point > 1 ? 1 : 0), 0), 0)
}


function filterOutDiagonals(input) {
    return input.filter(pair => (pair[0][0] == pair[1][0] || pair[0][1] == pair[1][1]))
}


// find points between two coordinates
function mapPointsBetween(start, end, map) {
    const diffy = end[0] - start[0]
    const diffx = end[1] - start[1]

    const stepy = diffy?diffy / Math.abs(diffy):0
    const stepx = diffx?diffx / Math.abs(diffx):0

    for (let i = start; i.toString() != end.toString(); i[0]+=stepy, i[1]+=stepx) {
        let point = i
        map[point[0]][point[1]]++
    }
    map[end[0]][end[1]]++

    return map
}


console.log(task2(input))