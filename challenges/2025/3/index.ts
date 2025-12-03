const data = await Bun.file('./challenges/2025/3/data.txt').text();

const IS_PART_ONE = false;

const BATTERIES_PER_OUTPUT = IS_PART_ONE ? 2 : 12; // eslint-disable-line @typescript-eslint/no-unnecessary-condition
const MAX_BATTERY_JOLTAGE = 9;

const banks = data.split('\n').map((bank) => [...bank].map((battery) => Number.parseInt(battery)));

let totalOutputJoltage = 0;

for (const bank of banks) {
    let outputJoltage = 0;

    let lastElementIndex = -1;

    for (let digit = BATTERIES_PER_OUTPUT - 1; digit >= 0; digit--) {
        const [highest, index] = getHighestFromArray(bank, [lastElementIndex + 1, bank.length - digit], MAX_BATTERY_JOLTAGE);
        lastElementIndex = index;

        outputJoltage += highest * 10 ** digit;
    }

    totalOutputJoltage += outputJoltage;
}

/**
 * Gets the highest valued entry in an array, returning an array containing the highest element and its index.
 * @param array The array to search through.
 * @param range The range of indices to search through.
 * @param maximum The maximum possible element to optimize searches.
 */
function getHighestFromArray(array: number[], range: [number, number], maximum: number) {
    let highest = 0;
    let highestIndex = -1;

    for (const [index, element] of array.slice(...range).entries())
        if (element > highest) {
            highest = element;
            highestIndex = index;
            if (highest === maximum) break;
        }

    highestIndex += range[0];

    return [highest, highestIndex];
}

export default totalOutputJoltage;
