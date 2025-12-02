const data = await Bun.file('./challenges/2024/24/data.txt').text();

const [rawWireValues, rawGates] = data.split('\n\n');

const wireValues = new Map<string, number>();

for (const rawWireValue of rawWireValues.split('\n')) {
    const [wire, value] = rawWireValue.split(': ');
    wireValues.set(wire, Number.parseInt(value));
}

const gates = rawGates.split('\n').map((rawGate) => {
    const [input, output] = rawGate.split(' -> ');

    const [firstWire, operation, secondWire] = input.split(' ') as [string, 'AND' | 'OR' | 'XOR', string];

    return { firstWire, operation, secondWire, output };
});

const partOneGates = gates.map((gate) => ({ ...gate }));

while (partOneGates.length > 0) {
    const gate = partOneGates.shift()!;

    const { firstWire, operation, secondWire, output } = gate;

    if (wireValues.has(firstWire) && wireValues.has(secondWire)) {
        const firstWireValue = wireValues.get(firstWire)!;
        const secondWireValue = wireValues.get(secondWire)!;

        let outputValue: number;
        switch (operation) {
            case 'AND': {
                outputValue = firstWireValue & secondWireValue;
                break;
            }
            case 'OR': {
                outputValue = firstWireValue | secondWireValue;
                break;
            }
            case 'XOR': {
                outputValue = firstWireValue ^ secondWireValue;
                break;
            }
        }

        wireValues.set(output, outputValue);
    } else partOneGates.push(gate);
}

// Part One
const wiresWithZ = wireValues
    .entries()
    .toArray()
    .filter(([wire]) => wire.startsWith('z'))
    .sort(([wireA], [wireB]) => wireB.localeCompare(wireA));

const binaryNumber = wiresWithZ.map(([, value]) => value.toString()).join('');

const decimalNumber = Number.parseInt(binaryNumber, 2);

export const partOne = decimalNumber;

// Part Two (modified from https://github.com/CodingAP/advent-of-code/blob/main/puzzles/2024/day24/solution.ts as I didn't know anything about carry adders)
const incorrectGates: string[] = [];

for (let index = 0; index < 45; index++) {
    const id = index.toString().padStart(2, '0');

    const xorOperationGate = gates.find(
        (gate) =>
            ((gate.firstWire === `x${id}` && gate.secondWire === `y${id}`) ||
                (gate.firstWire === `y${id}` && gate.secondWire === `x${id}`)) &&
            gate.operation === 'XOR',
    );
    const andOperationGate = gates.find(
        (gate) =>
            ((gate.firstWire === `x${id}` && gate.secondWire === `y${id}`) ||
                (gate.firstWire === `y${id}` && gate.secondWire === `x${id}`)) &&
            gate.operation === 'AND',
    );
    const zOutputGate = gates.find((gate) => gate.output === `z${id}`);

    if (!xorOperationGate || !andOperationGate || !zOutputGate) continue;

    // Each z must be connected to an XOR
    if (zOutputGate.operation !== 'XOR') incorrectGates.push(zOutputGate.output);

    // Each AND must go to an OR (besides the first case as it starts the carry flag)
    const orOperationGate = gates.find((gate) => gate.firstWire === andOperationGate.output || gate.secondWire === andOperationGate.output);
    if (orOperationGate && orOperationGate.operation !== 'OR' && index > 0) incorrectGates.push(andOperationGate.output);

    // The first XOR must to go to XOR or AND
    const afterGate = gates.find((gate) => gate.firstWire === xorOperationGate.output || gate.secondWire === xorOperationGate.output);
    if (afterGate?.operation === 'OR') incorrectGates.push(xorOperationGate.output);
}

// Each XOR must be connected to an x, y, or z
incorrectGates.push(
    ...gates
        .filter(
            (gate) =>
                !gate.firstWire[0].startsWith('x') &&
                !gate.firstWire[0].startsWith('y') &&
                !gate.secondWire[0].startsWith('x') &&
                !gate.secondWire[0].startsWith('y') &&
                !gate.output[0].startsWith('z') &&
                gate.operation === 'XOR',
        )
        .map((gate) => gate.output),
);

export default incorrectGates.sort().join(',');
