def task1(map: list[str], to_right: int = 3, to_down: int = 1) -> int:
    trees = 0
    pos = [0, 0]
    while pos[1] < len(map)-1:
        pos[0] = (pos[0] + to_right) % len(map[0])
        pos[1] += to_down
        if map[pos[1]][pos[0]] == '#':
            trees += 1
    return trees


def task2(map: list[str], slopes: list[list[int]]) -> int:
    result = 1
    for slope in slopes:
        result *= task1(map, *slope)
    return result


slopes = [[1, 1],
          [3, 1],
          [5, 1],
          [7, 1],
          [1, 2]]


input: list[str] = []

print(task1(input))
print(task2(input, slopes))
