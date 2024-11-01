def task1(passes: list[str]) -> int:
    max = 0
    for pass_ in passes:
        row = get_half(0, 127, pass_[0:7])
        col = get_half(0, 7, pass_[7:])
        id = get_id(row, col)
        if id > max:
            max = id
    return max


def task2(passes: list[str]) -> int:
    ids: set = set()
    for pass_ in passes:
        row = get_half(0, 127, pass_[0:7])
        col = get_half(0, 7, pass_[7:])
        id = get_id(row, col)
        ids.add(id)
    low = min(ids)
    high = max(ids)
    for id in range(low+1, high-1):
        if id not in ids:
            return id
    return 0


def get_half(min: int, max: int, side: str) -> int:
    if min == max:
        return min
    match side[0]:
        case 'F':
            return get_half(min, (max-min)//2+min, side[1:])
        case 'B':
            return get_half(min + (max-min+1)//2, max, side[1:])
        case 'L':
            return get_half(min, (max-min)//2+min, side[1:])
        case 'R':
            return get_half(min + (max-min+1)//2, max, side[1:])
    return 0


def get_id(row: int, col: int):
    return row * 8 + col


input: list[str] = []

print(task1(input))
print(task2(input))
