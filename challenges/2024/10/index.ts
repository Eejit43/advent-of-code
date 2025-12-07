const data = await Bun.file('./challenges/2024/10/data.txt').text();

const rows = data.split('\n').map((characters) => [...characters].map((character) => Number.parseInt(character)));

const trailheads = rows.flatMap((row, rowIndex) =>
    [...row].map((number, columnIndex) => (number === 0 ? [rowIndex, columnIndex] : false)).filter(Boolean),
) as [number, number][];

const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
];

// Part One
let partOneTrailheadScoreSum = 0;

for (const trailhead of trailheads) partOneTrailheadScoreSum += partOneGetScoreFromPoint(trailhead, 0, new Set<string>());

/**
 * Gets the score from a given point in the map.
 * @param point The point to search from.
 * @param value The current point's value.
 * @param reachedTrailheads The reached trailheads.
 */
function partOneGetScoreFromPoint(point: [number, number], value: number, reachedTrailheads: Set<string>) {
    let score = 0;

    for (const direction of directions) {
        const newPointLocation: [number, number] = [point[0] + direction[0], point[1] + direction[1]];
        const newPoint = rows[newPointLocation[0]]?.[newPointLocation[1]];

        if (!newPoint) continue;

        if (newPoint === value + 1)
            if (newPoint === 9) {
                if (!reachedTrailheads.has(newPointLocation.toString())) {
                    score++;
                    reachedTrailheads.add(newPointLocation.toString());
                }
            } else score += partOneGetScoreFromPoint(newPointLocation, newPoint, reachedTrailheads);
    }

    return score;
}

export { partOneTrailheadScoreSum };

// Part Two
let partTwoTrailheadScoreSum = 0;

for (const trailhead of trailheads) partTwoTrailheadScoreSum += partTwoGetScoreFromPoint(trailhead, 0);

/**
 * Gets the score from a given point in the map.
 * @param point The point to search from.
 * @param value The current point's value.
 * @param currentPath The current path being traveled.
 */
function partTwoGetScoreFromPoint(point: [number, number], value: number, currentPath?: Set<string>) {
    let score = 0;

    currentPath ??= new Set([point.toString()]);

    for (const direction of directions) {
        const newPointLocation: [number, number] = [point[0] + direction[0], point[1] + direction[1]];
        const newPoint = rows[newPointLocation[0]]?.[newPointLocation[1]];

        if (!newPoint) continue;

        if (newPoint === value + 1)
            if (newPoint === 9) score++;
            else {
                currentPath.add(point.toString());

                score += partTwoGetScoreFromPoint(newPointLocation, newPoint, currentPath);
            }
    }

    return score;
}

export default partTwoTrailheadScoreSum;
