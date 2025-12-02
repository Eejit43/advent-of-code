const data = await Bun.file('./challenges/2024/18/data.txt').text();

const MAP_SIZE = 71;

const corruptions = data.split('\n').map((row) => row.split(',').map(Number));

const map = Array.from({ length: MAP_SIZE }).map(() => Array.from({ length: MAP_SIZE }).fill('.'));

/**
 * Gets the amount of steps required to reach the end of the map with the given amount of corruptions.
 * @param corruptionAmount The amount of corruptions to apply to the map.
 */
function getStepsWithCorruptions(corruptionAmount: number) {
    const newMap = map.map((row) => [...row]);

    for (const [x, y] of corruptions.slice(0, corruptionAmount)) newMap[y][x] = '#';

    interface Location {
        row: number;
        column: number;
    }

    const moveOptions = [
        { row: -1, column: 0 },
        { row: 0, column: 1 },
        { row: 1, column: 0 },
        { row: 0, column: -1 },
    ];

    const visited = new Set<string>();

    let queue: [Location, number][] = [[{ row: 0, column: 0 }, 0]];

    let bestScore = Infinity;

    while (queue.length > 0) {
        const newQueue: [Location, number][] = [];

        for (const [location, steps] of queue) {
            const cacheKey = `${location.row},${location.column}`;

            const mazeValue = newMap[location.row]?.[location.column];

            if (!mazeValue || mazeValue === '#' || visited.has(cacheKey)) continue;

            visited.add(cacheKey);

            if (location.row === MAP_SIZE - 1 && location.column === MAP_SIZE - 1) {
                if (steps <= bestScore) bestScore = steps;

                break;
            }

            for (const offset of moveOptions) {
                const newLocation = { row: location.row + offset.row, column: location.column + offset.column };

                newQueue.push([newLocation, steps + 1]);
            }
        }

        queue = newQueue;
    }

    return bestScore;
}

// Part One
export const partOneScore = getStepsWithCorruptions(1024);

// Part Two
let start = 0;
let end = corruptions.length - 1;

let lastSuccessful = Infinity;

while (start <= end) {
    const midpoint = Math.floor((start + end) / 2);

    const steps = getStepsWithCorruptions(midpoint);

    if (Number.isFinite(steps)) {
        start = midpoint + 1;
        lastSuccessful = midpoint;
    } else end = midpoint - 1;
}

export default corruptions[lastSuccessful].join(',');
