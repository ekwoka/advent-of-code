def task1(passports: list[dict[str, str]], required: list[str]) -> int:
    valid = 0
    for psprt in passports:
        for req in required:
            if req not in psprt:
                break
        else:
            valid += 1
    return valid


def task2(passports: list[dict[str, str]], required: list[str]) -> int:
    valid = 0
    for psprt in passports:
        for req in required:
            if req not in psprt:
                break
            if not(is_valid(psprt, req)):
                break
        else:
            valid += 1
    return valid


def is_valid(psprt: dict[str, str], req: str) -> bool:
    match req:
        case 'byr':
            if not(checkbyr(int(psprt[req]))):
                return False
        case 'iyr':
            if not(checkiyr(int(psprt[req]))):
                return False
        case 'eyr':
            if not(checkeyr(int(psprt[req]))):
                return False
        case 'hgt':
            if not(checkhgt(psprt[req])):
                return False
        case 'hcl':
            if not(checkhcl(psprt[req])):
                return False
        case 'ecl':
            if not(checkecl(psprt[req])):
                return False
        case 'pid':
            if not(pid(psprt[req])):
                return False
    return True


def checkbyr(byr: int) -> bool:
    return 1920 <= byr <= 2002


def checkiyr(iyr: int) -> bool:
    return 2010 <= iyr <= 2020


def checkeyr(eyr: int) -> bool:
    return 2020 <= eyr <= 2030


def checkhgt(hgt: str) -> bool:
    if hgt[-2:] == 'cm':
        return 150 <= int(hgt[:-2]) <= 193
    elif hgt[-2:] == 'in':
        return 59 <= int(hgt[:-2]) <= 76
    else:
        return False


def checkhcl(hcl: str) -> bool:
    return hcl[0] == '#' and len(hcl) == 7 and all(c in '0123456789abcdef' for c in hcl[1:])


def checkecl(ecl: str) -> bool:
    return ecl in ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']


def pid(pid: str) -> bool:
    return len(pid) == 9 and all(c in '0123456789' for c in pid)


required_fields = [
    'byr',
    'iyr',
    'eyr',
    'hgt',
    'hcl',
    'ecl',
    'pid',
]

passports = []

print(task1(passports, required_fields))
print(task2(passports, required_fields))
