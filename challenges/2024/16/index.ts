const data = await Bun.file('./challenges/2024/16/data.txt').text();

const maze = data.split('\n').map((row) => [...row]);

interface Location {
    row: number;
    column: number;
}

let mazeStart: Location | undefined;

for (const [rowIndex, row] of maze.entries()) {
    for (const [columnIndex, column] of row.entries())
        if (column === 'S') {
            mazeStart = { row: rowIndex, column: columnIndex };
            break;
        }

    if (mazeStart) break;
}

enum Direction {
    Up,
    Right,
    Down,
    Left,
}

const moveOptions = {
    [Direction.Up]: { row: -1, column: 0 },
    [Direction.Right]: { row: 0, column: 1 },
    [Direction.Down]: { row: 1, column: 0 },
    [Direction.Left]: { row: 0, column: -1 },
};

const cachedScores: Record<string, number> = {};

let queue: [Location, Direction, number, Location[]][] = [[mazeStart!, Direction.Right, 0, [mazeStart!]]];

let bestScore = Infinity;
const paths: [Location[], number][] = [];

while (queue.length > 0) {
    const newQueue: [Location, Direction, number, Location[]][] = [];

    for (const [location, direction, score, path] of queue) {
        const cacheKey = `${location.row},${location.column},${direction}`;

        const mazeValue = maze[location.row][location.column];

        if (mazeValue === '#' || score > cachedScores[cacheKey]) continue;

        cachedScores[cacheKey] = score;

        if (mazeValue === 'E') {
            if (score <= bestScore) bestScore = score;

            paths.push([path, score]);

            continue;
        }

        const directions: Direction[] = [direction, (direction + 1) % 4, (direction + 3) % 4];

        for (const newDirection of directions) {
            const offset = moveOptions[newDirection];

            const newLocation = { row: location.row + offset.row, column: location.column + offset.column };

            const newScore = score + (newDirection === direction ? 1 : 1001);

            const newPath = [...path, newLocation];

            newQueue.push([newLocation, newDirection, newScore, newPath]);
        }
    }

    queue = newQueue;
}

// Part One
export { bestScore };

// Part Two
const seatingPositions = new Set<string>();

const bestPaths = paths.filter(([, score]) => score === bestScore);

for (const seat of bestPaths.flatMap(([path]) => path)) seatingPositions.add(`${seat.row},${seat.column}`);

export default seatingPositions.size;
