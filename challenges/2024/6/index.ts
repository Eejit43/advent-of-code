const data = await Bun.file('./challenges/2024/6/data.txt').text();

const rowsOriginal = data.split('\n').map((row) => [...row]);

const rows = rowsOriginal.map((row) => [...row]);

enum Direction {
    Up,
    Right,
    Down,
    Left,
}

const directionsOffset = {
    [Direction.Up]: [-1, 0],
    [Direction.Right]: [0, 1],
    [Direction.Down]: [1, 0],
    [Direction.Left]: [0, -1],
};

// Part One
let startLocation = [0, 0];
let currentLocation = [0, 0];
let currentDirection = Direction.Up;

for (const [rowIndex, row] of rows.entries())
    if (row.includes('^')) {
        startLocation = [rowIndex, row.indexOf('^')];
        currentLocation = [rowIndex, row.indexOf('^')];

        break;
    }

while (true) {
    const [currentRow, currentColumn] = currentLocation;
    const [rowOffset, columnOffset] = directionsOffset[currentDirection] as [number, number];

    const newRow = currentRow + rowOffset;
    const newColumn = currentColumn + columnOffset;

    const nextCharacter = rows[newRow]?.[newColumn];

    if (!nextCharacter) {
        rows[currentRow][currentColumn] = '-';

        break;
    }

    if (nextCharacter === '#') currentDirection = (currentDirection + 1) % 4;
    else {
        rows[currentRow][currentColumn] = '-';

        currentLocation = [newRow, newColumn];
    }
}

const pathCount = rows.flat().filter((character) => character === '-').length;

export { pathCount };

// Part Two
let possiblePositionsCausingLoop = 0;

for (const [rowIndex, row] of rowsOriginal.entries())
    for (const [characterIndex, character] of row.entries())
        if (character === '.') {
            const newRows = rowsOriginal.map((row) => [...row]);

            newRows[rowIndex][characterIndex] = '#';

            let currentLocation = startLocation;
            let currentDirection = Direction.Up;

            const visited = new Set();

            while (true) {
                const [currentRow, currentColumn] = currentLocation;

                if (visited.has(`${currentRow},${currentColumn},${currentDirection}`)) {
                    possiblePositionsCausingLoop++;

                    break;
                }
                visited.add(`${currentRow},${currentColumn},${currentDirection}`);

                const [rowOffset, columnOffset] = directionsOffset[currentDirection] as [number, number];

                const newRow = currentRow + rowOffset;
                const newColumn = currentColumn + columnOffset;

                const nextCharacter = newRows[newRow]?.[newColumn];

                if (!nextCharacter) break;

                if (nextCharacter === '#') currentDirection = (currentDirection + 1) % 4;
                else currentLocation = [newRow, newColumn];
            }
        }

export default possiblePositionsCausingLoop;
