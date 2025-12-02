const data = await Bun.file('./challenges/2024/4/data.txt').text();

const rows = data.split('\n');

// Part One
const searchString = 'XMAS';

const directions = [
    [0, 1],
    [0, -1],
    [1, 0],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
];

let matchedWords = 0;

for (const [rowIndex, row] of rows.entries())
    for (const [columnIndex, character] of [...row].entries())
        if (character === searchString[0])
            for (const [rowOffset, columnOffset] of directions) {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                const result = Array.from({ length: searchString.length }).map((_, index) => {
                    return rows[rowIndex + rowOffset * index]?.[columnIndex + columnOffset * index];
                });

                if (result.join('') === searchString) matchedWords++;
            }

export { matchedWords };

// Part Two
const validStrings = ['MSAMS', 'SMASM', 'SSAMM', 'MMASS'];

const layout = [
    [-1, -1],
    [-1, 1],
    [0, 0],
    [1, -1],
    [1, 1],
];

let matchedXs = 0;

for (const [rowIndex, row] of rows.entries())
    for (const [columnIndex, character] of [...row].entries())
        if (character === validStrings[0][Math.floor(validStrings[0].length / 2)]) {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            const result = Array.from({ length: validStrings[0].length }).map((_, index) => {
                const [rowOffset, columnOffset] = layout[index];

                return rows[rowIndex + rowOffset]?.[columnIndex + columnOffset];
            });

            if (validStrings.includes(result.join(''))) matchedXs++;
        }

export default matchedXs;
