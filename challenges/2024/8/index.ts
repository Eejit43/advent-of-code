const data = await Bun.file('./challenges/2024/8/data.txt').text();

const rows = data.split('\n').map((row) => [...row]);

const networks: Record<string, [number, number][]> = {};

// Part One
const antinodes = new Set<string>();

for (const [rowIndex, row] of rows.entries())
    for (const [columnIndex, character] of row.entries())
        if (character !== '.')
            if (character in networks) networks[character].push([rowIndex, columnIndex]);
            else networks[character] = [[rowIndex, columnIndex]];

for (const network of Object.values(networks))
    for (const [firstAntennaIndex, firstAntenna] of network.entries())
        for (const [nextAntennaIndex, nextAntenna] of network.entries()) {
            if (firstAntennaIndex === nextAntennaIndex) continue;

            const rowOffset = nextAntenna[0] - firstAntenna[0];
            const columnOffset = nextAntenna[1] - firstAntenna[1];

            const firstAntinode = [firstAntenna[0] - rowOffset, firstAntenna[1] - columnOffset];
            const secondAntinode = [nextAntenna[0] + rowOffset, nextAntenna[1] + columnOffset];

            if (rows[firstAntinode[0]]?.[firstAntinode[1]]) antinodes.add(firstAntinode.join(','));
            if (rows[secondAntinode[0]]?.[secondAntinode[1]]) antinodes.add(secondAntinode.join(','));
        }

export const amount = antinodes.size;

// Part Two
const partTwoAntinodes = new Set<string>();

for (const network of Object.values(networks))
    for (const [firstAntennaIndex, firstAntenna] of network.entries())
        for (const [nextAntennaIndex, nextAntenna] of network.entries()) {
            if (firstAntennaIndex === nextAntennaIndex) continue;

            const rowOffset = nextAntenna[0] - firstAntenna[0];
            const columnOffset = nextAntenna[1] - firstAntenna[1];

            let beforeOffset = 1;
            while (true) {
                const firstNode = [nextAntenna[0] - rowOffset * beforeOffset, nextAntenna[1] - columnOffset * beforeOffset];
                const secondNode = [firstAntenna[0] + rowOffset * beforeOffset, firstAntenna[1] + columnOffset * beforeOffset];

                const actualFirstNode = rows[firstNode[0]]?.[firstNode[1]];
                const actualSecondNode = rows[secondNode[0]]?.[secondNode[1]];

                if (!actualFirstNode && !actualSecondNode) break;

                if (actualFirstNode) partTwoAntinodes.add(firstNode.join(','));
                if (actualSecondNode) partTwoAntinodes.add(secondNode.join(','));

                beforeOffset++;
            }
        }

export default partTwoAntinodes.size;
