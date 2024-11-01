import re


def get_match(pattern: str, text: str):
    match = re.search(pattern, text)
    if match:
        return match.group()
    else:
        return None


def task1(pwrds: list[str]) -> int:
    valid: int = 0
    for p in pwrds:
        min = int(get_match(r'\d+', p))
        max = int(get_match(r'-\d+', p)[1:])
        char = get_match(r'[a-z]', p)
        wrd = get_match(r'[a-z]{2,}', p)
        if not(min and max and char and wrd):
            continue
        if min > len(wrd):
            continue
        char_count: int = len(re.findall(char, p)) - 1
        if char_count >= min and char_count <= max:
            valid += 1

    return valid


def task2(pwrds: list[str]) -> int:
    valid: int = 0
    for p in pwrds:
        pos1 = int(get_match(r'\d+', p))
        pos2 = int(get_match(r'-\d+', p)[1:])
        char = get_match(r'[a-z]', p)
        wrd = get_match(r'[a-z]{2,}', p)
        if not(min and max and char and wrd):
            continue
        if wrd[pos1-1] == char and wrd[pos2-1] == char:
            continue
        if wrd[pos1-1] == char or wrd[pos2-1] == char:
            valid += 1
    return valid


input: list[str] = []

print(task1(input))
print(task2(input))
