const data = await Bun.file('./challenges/2025/9/data.txt').text();

const IS_PART_ONE = false;

const coordinates = data.split('\n').map((line) => line.split(',').map(Number)) as [number, number][];

const allPairPairs = [];

for (const [index, coordinatePair] of coordinates.entries()) {
    const [x1, y1] = coordinatePair;
    for (const otherCoordinatePair of coordinates.slice(index + 1)) {
        const [x2, y2] = otherCoordinatePair;

        const area = (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1);

        allPairPairs.push({ coordinatePair1: coordinatePair, coordinatePair2: otherCoordinatePair, area });
    }
}

allPairPairs.sort((a, b) => b.area - a.area);

const part1 = allPairPairs[0].area;

const edges = coordinates.map((coordinatePair, index) => {
    const nextPair = coordinates[(index + 1) % coordinates.length];

    return { from: coordinatePair, to: nextPair };
});

const part2 = allPairPairs.find(
    ({ coordinatePair1: [x1, y1], coordinatePair2: [x2, y2] }) =>
        !edges.some((edge) => doesOverlap([edge.from[1], edge.to[1]], [y1, y2]) && doesOverlap([edge.from[0], edge.to[0]], [x1, x2])),
)!.area;

/**
 * Checks if two lines overlap in either the x or y dimension.
 * @param line1 The first line.
 * @param line2 The second line.
 */
function doesOverlap(line1: [number, number], line2: [number, number]) {
    const [aStart, aEnd] = line1;
    const [bStart, bEnd] = line2;

    return (
        !(aStart <= bStart && aStart <= bEnd && aEnd <= bStart && aEnd <= bEnd) &&
        !(aStart >= bStart && aStart >= bEnd && aEnd >= bStart && aEnd >= bEnd)
    );
}

export default IS_PART_ONE ? part1 : part2; // eslint-disable-line @typescript-eslint/no-unnecessary-condition
