const data = await Bun.file('./challenges/2025/4/data.txt').text();

const IS_PART_ONE = false;

const map = data.split('\n').map((row) => [...row]);

let accessibleRollsOfPaper = 0;

for (const [rowIndex, row] of map.entries())
    for (const [columnIndex, column] of row.entries()) {
        if (column !== '@') continue;

        const surroundingCells = getSurroundingCalls(rowIndex, columnIndex);

        const surroundingRollsOfPaper = surroundingCells.filter((cell) => cell === '@');

        if (surroundingRollsOfPaper.length < 4) accessibleRollsOfPaper++;
    }

let totalRollsRemoved = 0;
let didRemoveRoll = true;

while (didRemoveRoll) {
    didRemoveRoll = false;

    for (const [rowIndex, row] of map.entries())
        for (const [columnIndex, column] of row.entries()) {
            if (column !== '@') continue;

            const surroundingCells = getSurroundingCalls(rowIndex, columnIndex);

            const surroundingRollsOfPaper = surroundingCells.filter((cell) => cell === '@');

            if (surroundingRollsOfPaper.length < 4) {
                didRemoveRoll = true;
                totalRollsRemoved++;
                map[rowIndex][columnIndex] = '.';
            }
        }
}

/**
 * Gets the surrounding calls of a given cell in the map.
 * @param rowIndex The row index.
 * @param columnIndex The column index.
 */
function getSurroundingCalls(rowIndex: number, columnIndex: number) {
    const surroundingCells: string[] = [];

    for (let row = rowIndex - 1; row <= rowIndex + 1; row++)
        for (let column = columnIndex - 1; column <= columnIndex + 1; column++) {
            if (row === rowIndex && column === columnIndex) continue;
            if (row < 0 || column < 0 || row >= map.length || column >= map[row].length) continue;

            surroundingCells.push(map[row][column]);
        }

    return surroundingCells;
}

export default IS_PART_ONE ? accessibleRollsOfPaper : totalRollsRemoved; // eslint-disable-line @typescript-eslint/no-unnecessary-condition
