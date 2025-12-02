const data = await Bun.file('./challenges/2024/3/data.txt').text();

const corruptedString = data.replaceAll('\n', ' ');

// Part One
const mulInstructions = corruptedString.match(/mul\(\d{1,3},\d{1,3}\)/g)!;

let total = 0;

for (const instruction of mulInstructions) {
    const [, first, second] = /mul\((\d{1,3}),(\d{1,3})\)/.exec(instruction)!;

    total += Number.parseInt(first) * Number.parseInt(second);
}

export { total };

// Part Two
const instructions = corruptedString.match(/do(n't)?\(\)|mul\(\d{1,3},\d{1,3}\)/g)!;

let enabledTotal = 0;

let isEnabled = true;

for (const instruction of instructions)
    if (instruction === 'do()') isEnabled = true;
    else if (instruction === "don't()") isEnabled = false;
    else {
        if (!isEnabled) continue;

        const [, first, second] = /mul\((\d{1,3}),(\d{1,3})\)/.exec(instruction)!;

        enabledTotal += Number.parseInt(first) * Number.parseInt(second);
    }

export default enabledTotal;
