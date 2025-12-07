const data = await Bun.file('./challenges/2025/7/data.txt').text();

const IS_PART_ONE = false;

const map = data.split('\n').map((row) => [...row].map((entry) => ({ character: entry, timelines: 0 })));

const startLocation = map[0].findIndex((entry) => entry.character === 'S');

map[0][startLocation].timelines = 1;

let timesSplit = 0;

for (let rowIndex = 0; rowIndex < map.length; rowIndex++) {
    if (rowIndex === 0) continue;

    const row = map[rowIndex];

    const newRow = row.map((cell) => ({ ...cell, timelines: 0 }));

    for (const [columnIndex, entry] of row.entries()) {
        const incomingRay = map[rowIndex - 1][columnIndex];
        if (incomingRay.character === '^' || incomingRay.timelines === 0) continue;

        if (entry.character === '^') {
            timesSplit++;

            newRow[columnIndex].timelines += incomingRay.timelines;

            newRow[columnIndex - 1].timelines += incomingRay.timelines;
            newRow[columnIndex + 1].timelines += incomingRay.timelines;
        } else if (entry.character === '.') newRow[columnIndex].timelines += incomingRay.timelines;
    }

    map[rowIndex] = newRow;
}

const timelinesCount = map.at(-1)!.reduce((sum, entry) => sum + entry.timelines, 0);

export default IS_PART_ONE ? timesSplit : timelinesCount; // eslint-disable-line @typescript-eslint/no-unnecessary-condition
