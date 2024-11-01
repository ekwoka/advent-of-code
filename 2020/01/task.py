input: list[int] = []


def part1(nums: list[int]) -> int:
    for i in nums:
        for j in nums:
            if i + j == 2020:
                return i * j
    return 0


def part2(nums: list[int]) -> int:
    for i in nums:
        for j in nums:
            for k in nums:
                if i + j + k == 2020:
                    return i * j * k
    return 0


print(part1(input))

print(part2(input))
