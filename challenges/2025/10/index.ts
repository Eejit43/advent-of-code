// NOTE: Due to restrictions with Bun, this day's code for part 2 requires Node.
//       Run both parts with `node challenges/2025/10/index.ts`

// NOTE: Unfortunately this challenge was far outside of my wheelhouse and thus much of this code was not fully created by me.

import { readFileSync } from 'node:fs';
import { type Arith, init, type IntNum } from 'z3-solver';

const data = readFileSync('./challenges/2025/10/data.txt').toString();

const machines = data.split('\n').map((line) => {
    const [, indicatorLights, wiringSchematics, joltageRequirements] = /\[(.+?)] (.+?) {(.+?)}/.exec(line)!;

    return {
        indicatorLights: [...indicatorLights].map((light) => light === '#'),
        wiringSchematics: wiringSchematics.split(' ').map((schematic) => schematic.slice(1, -1).split(',').map(Number)),
        joltageRequirements: joltageRequirements.split(',').map(Number),
    };
});

/**
 * Solve one machine using Gaussian elimination over GF(2).
 * @param requirements Desired state of indicator lights.
 * @param buttons Wiring schematics (which lights each button toggles).
 */
function solveMachine(requirements: boolean[], buttons: number[][]): number {
    const rowCount = requirements.length; // lights
    const columnCount = buttons.length; // buttons

    // Build matrix
    const unaugmentedMatrix = Array.from({ length: rowCount }, () => Array.from<number>({ length: columnCount }).fill(0));
    for (let index = 0; index < columnCount; index++) for (const light of buttons[index]) unaugmentedMatrix[light][index] = 1;

    // Build vector
    const bVector = requirements.map((requirement) => (requirement ? 1 : 0));

    // Form augmented matrix
    const augmentedMatrix = unaugmentedMatrix.map((row, index) => [...row, bVector[index]]);

    // Gaussian elimination
    let row = 0;
    const pivotRowForColumn = Array.from<number>({ length: columnCount }).fill(-1);

    for (let column = 0; column < columnCount && row < rowCount; column++) {
        // Find pivot
        let selected = -1;
        for (let index = row; index < rowCount; index++)
            if (augmentedMatrix[index][column] === 1) {
                selected = index;
                break;
            }
        if (selected === -1) continue;

        // Swap rows
        [augmentedMatrix[row], augmentedMatrix[selected]] = [augmentedMatrix[selected], augmentedMatrix[row]];
        pivotRowForColumn[column] = row;

        // Eliminate column
        for (let rowIndex = 0; rowIndex < rowCount; rowIndex++)
            if (rowIndex !== row && augmentedMatrix[rowIndex][column] === 1)
                for (let columnIndex = column; columnIndex <= columnCount; columnIndex++)
                    augmentedMatrix[rowIndex][columnIndex] ^= augmentedMatrix[row][columnIndex];

        row++;
    }

    // Check for inconsistency (0 = 1)
    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        let allZero = true;
        for (let columnIndex = 0; columnIndex < columnCount; columnIndex++)
            if (augmentedMatrix[rowIndex][columnIndex] !== 0) {
                allZero = false;
                break;
            }

        if (allZero && augmentedMatrix[rowIndex][columnCount] === 1)
            // No solution
            return Infinity;
    }

    // Identify free variables
    const freeColumns = [];
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex++)
        if (pivotRowForColumn[columnIndex] === -1) freeColumns.push(columnIndex);

    let best = Infinity;

    // Enumerate all assignments to free variables
    const freeCount = freeColumns.length;
    for (let mask = 0; mask < 1 << freeCount; mask++) {
        const buttonStates = Array.from<number>({ length: columnCount }).fill(0);

        // Assign free variables
        for (let index = 0; index < freeCount; index++) buttonStates[freeColumns[index]] = (mask >> index) & 1;

        // Solve pivot variables
        for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
            const r = pivotRowForColumn[columnIndex];
            if (r !== -1) {
                let value = augmentedMatrix[r][columnCount];
                for (let k = columnIndex + 1; k < columnCount; k++) value ^= augmentedMatrix[r][k] & buttonStates[k];

                buttonStates[columnIndex] = value;
            }
        }

        // Count presses
        let presses = 0;
        for (const state of buttonStates) presses += state;

        if (presses < best) best = presses;
    }

    return best;
}

let part1Presses = 0;

for (const machine of machines) part1Presses += solveMachine(machine.indicatorLights, machine.wiringSchematics);

console.log(`Part 1: ${part1Presses}`); // eslint-disable-line no-console

const { Context: z3Context } = await init();

/**
 * Solve one machine using Z3 SMT solver.
 * @param requirements Desired counter values.
 * @param buttons Wiring schematics (which counters each button affects).
 */
async function solveMachineJoltageZ3(requirements: number[], buttons: number[][]) {
    const { Int: intCreator, Optimize: z3Optimizer } = z3Context('machine');

    const solver = new z3Optimizer();

    // One Int variable per button
    const variables = buttons.map((button, index) => {
        const variable = intCreator.const(`b${index}`);
        solver.add(variable.ge(0));
        return variable;
    });

    // One constraint per counter
    for (const [requirementIndex, requirement] of requirements.entries()) {
        let expression: IntNum<'machine'> | Arith<'machine'> = intCreator.val(0);

        for (let buttonIndex = 0; buttonIndex < buttons.length; buttonIndex++)
            if (buttons[buttonIndex].includes(requirementIndex)) expression = expression.add(variables[buttonIndex]);

        solver.add(expression.eq(intCreator.val(requirement)));
    }

    // Minimize total presses
    const total = variables.reduce((accumulator, variable) => accumulator.add(variable), intCreator.val(0)); // eslint-disable-line unicorn/no-array-reduce
    solver.minimize(total);

    const result = await solver.check();
    if (result !== 'sat') throw new Error('No solution');

    const model = solver.model();
    return Number.parseInt(model.eval(total).toString(), 10); // eslint-disable-line @typescript-eslint/no-base-to-string
}

let part2Presses = 0;

for (const machine of machines) part2Presses += await solveMachineJoltageZ3(machine.joltageRequirements, machine.wiringSchematics); // eslint-disable-line no-await-in-loop

console.log(`Part 2: ${part2Presses}`); // eslint-disable-line no-console
