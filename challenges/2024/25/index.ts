const data = await Bun.file('./challenges/2024/25/data.txt').text();

const locks = [];
const keys = [];

for (const lockOrKey of data.split('\n\n')) {
    const lines = lockOrKey.split('\n');

    const columns = [0, 0, 0, 0, 0];

    for (const line of lines) for (const [index, character] of [...line].entries()) if (character === '#') columns[index]++;

    if (lines[0].startsWith('#')) locks.push(columns);
    else keys.push(columns);
}

let nonOverlappingPairs = 0;

for (const lock of locks) for (const key of keys) if (key.every((value, index) => value + lock[index] <= 7)) nonOverlappingPairs++;

export default nonOverlappingPairs;
