const data = await Bun.file('./challenges/2024/20/data.txt').text();

const IS_PART_TWO = false;

const map = data.split('\n').map((row) => [...row]);

interface Location {
    row: number;
    column: number;
}

let endLocation!: Location;

for (const [rowIndex, row] of map.entries())
    for (const [columnIndex, type] of row.entries()) if (type === 'E') endLocation = { row: rowIndex, column: columnIndex };

const moveOptions = [
    { row: -1, column: 0 },
    { row: 0, column: 1 },
    { row: 1, column: 0 },
    { row: 0, column: -1 },
];

const cachedDistances = new Map<string, number>();

const queue: [Location, number][] = [[endLocation, 0]];

while (queue.length > 0) {
    const [location, steps] = queue.shift()!;

    for (const offset of moveOptions) {
        const newLocation = { row: location.row + offset.row, column: location.column + offset.column };

        const newValue = map[newLocation.row]?.[newLocation.column];

        if (!newValue || newValue === '#') continue;

        const cacheKey = `${newLocation.row},${newLocation.column}`;

        const newSteps = steps + 1;

        if (!cachedDistances.has(cacheKey) || cachedDistances.get(cacheKey)! > newSteps) {
            queue.push([newLocation, newSteps]);

            cachedDistances.set(cacheKey, newSteps);
        }
    }
}

let cheats = 0;

for (const [point, distance] of cachedDistances)
    for (const [otherPoint, otherDistance] of cachedDistances) {
        if (point === otherPoint) continue;

        const startPoint = point.split(',').map(Number);
        const endPoint = otherPoint.split(',').map(Number);

        const difference = Math.abs(startPoint[0] - endPoint[0]) + Math.abs(startPoint[1] - endPoint[1]);

        const stepsSaved = distance - otherDistance - difference;

        if (difference <= (IS_PART_TWO ? 20 : 2) && stepsSaved >= 100) cheats++; // eslint-disable-line @typescript-eslint/no-unnecessary-condition
    }

export default cheats;
