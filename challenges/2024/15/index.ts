const data = await Bun.file('./challenges/2024/15/data.txt').text();

const [mapData, movesData] = data.split('\n\n');

// Part One
enum PartOneMapType {
    Empty,
    Box,
    Wall,
}

const partOneMapCharactersToType: Record<string, PartOneMapType> = {
    /* eslint-disable @typescript-eslint/naming-convention */
    '@': PartOneMapType.Empty,
    '.': PartOneMapType.Empty,
    'O': PartOneMapType.Box,
    '#': PartOneMapType.Wall,
    /* eslint-enable @typescript-eslint/naming-convention */
};

const partOneMap: (PartOneMapType | undefined)[][] = [];

interface Location {
    row: number;
    column: number;
}

let robotStartLocation: Location = { row: 0, column: 0 };

for (const [rowIndex, row] of mapData.split('\n').entries()) {
    partOneMap.push([]);

    for (const [columnIndex, character] of [...row].entries()) {
        partOneMap[rowIndex].push(partOneMapCharactersToType[character]);

        if (character === '@') robotStartLocation = { row: rowIndex, column: columnIndex };
    }
}

let robotLocation = robotStartLocation;

enum MoveDirection {
    Up,
    Right,
    Down,
    Left,
}

const movesCharactersToType: Record<string, MoveDirection> = {
    /* eslint-disable @typescript-eslint/naming-convention */
    '^': MoveDirection.Up,
    '>': MoveDirection.Right,
    'v': MoveDirection.Down,
    '<': MoveDirection.Left,
    /* eslint-enable @typescript-eslint/naming-convention */
};

const movesOffset: Record<MoveDirection, Location> = {
    [MoveDirection.Up]: { row: -1, column: 0 },
    [MoveDirection.Right]: { row: 0, column: 1 },
    [MoveDirection.Down]: { row: 1, column: 0 },
    [MoveDirection.Left]: { row: 0, column: -1 },
};

const moves = [...movesData.split('\n').join('')].map((character) => movesCharactersToType[character]);

for (const move of moves) {
    const offset = movesOffset[move];

    const nextLocation: Location = { row: robotLocation.row + offset.row, column: robotLocation.column + offset.column };

    const nextType = partOneMap[nextLocation.row][nextLocation.column];

    if (nextType === PartOneMapType.Wall) continue;
    else if (nextType === PartOneMapType.Empty) robotLocation = nextLocation;
    else {
        let foundEmptySpace = null;

        for (let increment = 1; increment < mapData.length; increment++) {
            const newLocation = {
                row: robotLocation.row + offset.row * increment,
                column: robotLocation.column + offset.column * increment,
            };

            const nextType = partOneMap[newLocation.row]?.[newLocation.column];

            if (nextType === undefined || nextType === PartOneMapType.Wall) break;
            else if (nextType === PartOneMapType.Empty) {
                foundEmptySpace = newLocation;

                break;
            }
        }

        if (foundEmptySpace) {
            robotLocation = nextLocation;

            partOneMap[nextLocation.row][nextLocation.column] = PartOneMapType.Empty;
            partOneMap[foundEmptySpace.row][foundEmptySpace.column] = PartOneMapType.Box;
        }
    }
}

let partOneGpsCoordinatesSum = 0;

for (const [rowIndex, row] of partOneMap.entries())
    for (const [columnIndex, type] of row.entries())
        if (type === PartOneMapType.Box) partOneGpsCoordinatesSum += 100 * rowIndex + columnIndex;

export { partOneGpsCoordinatesSum };

// Part Two
enum PartTwoMapType {
    Empty,
    BoxStart,
    BoxEnd,
    Wall,
}

const partTwoMapCharactersToType: Record<string, PartTwoMapType[]> = {
    /* eslint-disable @typescript-eslint/naming-convention */
    '@': [PartTwoMapType.Empty, PartTwoMapType.Empty],
    '.': [PartTwoMapType.Empty, PartTwoMapType.Empty],
    'O': [PartTwoMapType.BoxStart, PartTwoMapType.BoxEnd],
    '#': [PartTwoMapType.Wall, PartTwoMapType.Wall],
    /* eslint-enable @typescript-eslint/naming-convention */
};

const partTwoMap: (PartTwoMapType | undefined)[][] = [];

for (const [rowIndex, row] of mapData.split('\n').entries()) {
    partTwoMap.push([]);

    for (const character of row) partTwoMap[rowIndex].push(...partTwoMapCharactersToType[character]);
}

robotLocation = { row: robotStartLocation.row, column: robotStartLocation.column * 2 };

for (const move of moves) {
    const offset = movesOffset[move];

    const nextLocation: Location = { row: robotLocation.row + offset.row, column: robotLocation.column + offset.column };

    const nextType = partTwoMap[nextLocation.row][nextLocation.column];

    if (nextType === PartTwoMapType.Wall) continue;
    else if (nextType === PartTwoMapType.Empty) robotLocation = nextLocation;
    else if (move === MoveDirection.Left || move === MoveDirection.Right) {
        let foundEmptySpace = false;
        const boxesToMove: Location[] = [];

        for (let increment = 1; increment < mapData.length; increment++) {
            const newLocation = {
                row: robotLocation.row + offset.row * increment,
                column: robotLocation.column + offset.column * increment,
            };

            const nextType = partTwoMap[newLocation.row]?.[newLocation.column];

            // eslint-disable-next-line unicorn/prefer-switch
            if (nextType === undefined || nextType === PartTwoMapType.Wall) break;
            else if (nextType === PartTwoMapType.Empty) {
                foundEmptySpace = true;

                break;
            } else if (nextType === PartTwoMapType.BoxStart) boxesToMove.push(newLocation);
        }

        if (foundEmptySpace) {
            robotLocation = nextLocation;

            clearMapOfBoxes(boxesToMove);
            for (const box of boxesToMove) moveBox(box, move);
        }
    } else {
        const boxesToMove = getBoxVerticalMoves(nextLocation, move);

        if (boxesToMove.length === 0) continue;

        robotLocation = nextLocation;

        clearMapOfBoxes(boxesToMove);
        for (const box of boxesToMove) moveBox(box, move);
    }
}

/**
 * Checks if a box can be pushed vertically (up or down).
 * @param location The location to check.
 * @param direction The move direction, either up or down.
 */
function getBoxVerticalMoves(location: Location, direction: MoveDirection): Location[] {
    const offset = movesOffset[direction];

    const nextLocationType = partTwoMap[location.row][location.column];
    if (nextLocationType === PartTwoMapType.BoxEnd) location = { row: location.row, column: location.column - 1 };

    const possibleOffsetLeftLocation: Location = { row: location.row + offset.row, column: location.column - 1 };
    const newLeftLocation: Location = { row: location.row + offset.row, column: location.column };
    const newRightLocation: Location = { row: location.row + offset.row, column: location.column + 1 };

    const newLeftType = partTwoMap[newLeftLocation.row]?.[newLeftLocation.column] ?? PartTwoMapType.Wall;
    const newRightType = partTwoMap[newRightLocation.row]?.[newRightLocation.column] ?? PartTwoMapType.Wall;

    const moves = [location];

    if (newLeftType === PartTwoMapType.Wall || newRightType === PartTwoMapType.Wall) moves.pop();
    else if (newLeftType === PartTwoMapType.Empty && newRightType === PartTwoMapType.Empty) return moves;
    else if (newLeftType === PartTwoMapType.BoxStart) moves.push(...getBoxVerticalMoves(newLeftLocation, direction));
    else {
        if (newLeftType === PartTwoMapType.BoxEnd) {
            const leftMoves = getBoxVerticalMoves(possibleOffsetLeftLocation, direction);
            if (leftMoves.length === 0) return [];

            moves.push(...leftMoves);
        }

        if (newRightType === PartTwoMapType.BoxStart) {
            const rightMoves = getBoxVerticalMoves(newRightLocation, direction);
            if (rightMoves.length === 0) return [];

            moves.push(...rightMoves);
        }
    }

    if (moves.length === 1) return [];

    return moves;
}

/**
 * Clears the map of given boxes.
 * @param boxes The boxes to clear from the map.
 */
function clearMapOfBoxes(boxes: Location[]) {
    for (const box of boxes) {
        partTwoMap[box.row][box.column] = PartTwoMapType.Empty;
        partTwoMap[box.row][box.column + 1] = PartTwoMapType.Empty;
    }
}

/**
 * Moves a box in a given direction.
 * @param box The box to move.
 * @param direction The move direction.
 */
function moveBox(box: Location, direction: MoveDirection) {
    const offset = movesOffset[direction];

    const newLeftLocation = { row: box.row + offset.row, column: box.column + offset.column };
    const newRightLocation = { row: box.row + offset.row, column: box.column + 1 + offset.column };

    partTwoMap[newLeftLocation.row][newLeftLocation.column] = PartTwoMapType.BoxStart;
    partTwoMap[newRightLocation.row][newRightLocation.column] = PartTwoMapType.BoxEnd;
}

let partTwoGpsCoordinatesSum = 0;

for (const [rowIndex, row] of partTwoMap.entries())
    for (const [columnIndex, type] of row.entries())
        if (type === PartTwoMapType.BoxStart) partTwoGpsCoordinatesSum += 100 * rowIndex + columnIndex;

export default partTwoGpsCoordinatesSum;
