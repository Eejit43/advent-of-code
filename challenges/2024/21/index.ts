const data = await Bun.file('./challenges/2024/21/data.txt').text();

const IS_PART_TWO = true;

const numericKeypadLayout = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    [null, '0', 'A'],
];

const directionalKeypadLayout = [
    [null, '^', 'A'],
    ['<', 'V', '>'],
];

interface Location {
    row: number;
    column: number;
}

const moveOptions: [string, Location][] = [
    ['^', { row: -1, column: 0 }],
    ['>', { row: 0, column: 1 }],
    ['V', { row: 1, column: 0 }],
    ['<', { row: 0, column: -1 }],
];

/**
 * Gets the optimal path in a map between two points.
 * @param map The map to traverse.
 * @param start The start point.
 * @param end The end point.
 */
function getBestPaths(map: (string | null)[][], start: string, end: string) {
    const visitedWithCost = new Map<string, number>();

    let startLocation!: Location;

    for (const [rowIndex, row] of map.entries())
        for (const [columnIndex, key] of row.entries()) if (key === start) startLocation = { row: rowIndex, column: columnIndex };

    const queue: [Location, string[]][] = [[startLocation, []]];

    const bestPaths: string[][] = [];
    let bestPathLength = Infinity;

    while (queue.length > 0) {
        const [location, path] = queue.shift()!;

        const key = `${location.row},${location.column}`;

        const mazeValue = map[location.row]?.[location.column];

        if (!mazeValue || (visitedWithCost.has(key) && visitedWithCost.get(key)! < path.length)) continue;

        visitedWithCost.set(key, path.length);

        if (path.length > bestPathLength) continue;

        if (mazeValue === end) {
            bestPaths.push(path);
            bestPathLength = path.length;
        }

        for (const [symbol, offset] of moveOptions) {
            const newLocation = { row: location.row + offset.row, column: location.column + offset.column };

            queue.push([newLocation, [...path, symbol]]);
        }
    }

    return bestPaths.map((path) => [...path, 'A']);
}

const cache = new Map<string, number>();

/**
 * Gets the fully expanded path for a given code with a given depth of expansions.
 * @param map The map to traverse.
 * @param code The code to traverse.
 * @param depth The depth of expansions.
 */
function getFullPath(map: (string | null)[][], code: string[], depth: number) {
    const key = `${code.join('')},${depth}`;

    if (cache.has(key)) return cache.get(key)!;

    let currentCharacter = 'A';

    let buttonPresses = 0;

    for (const nextCharacter of code) {
        const paths = getBestPaths(map, currentCharacter, nextCharacter);

        buttonPresses +=
            depth === 0 ? paths[0].length : Math.min(...paths.map((path) => getFullPath(directionalKeypadLayout, path, depth - 1)));

        currentCharacter = nextCharacter;
    }

    cache.set(key, buttonPresses);

    return buttonPresses;
}

let total = 0;

for (const code of data.split('\n')) total += getFullPath(numericKeypadLayout, [...code], IS_PART_TWO ? 25 : 2) * Number.parseInt(code); // eslint-disable-line @typescript-eslint/no-unnecessary-condition

export default total;
