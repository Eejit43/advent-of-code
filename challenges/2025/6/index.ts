const data = await Bun.file('./challenges/2025/6/data.txt').text();

// Part One
const part1ParsedData = data.split('\n').map((row) => row.trim().split(/ +/));

const part1Operators = part1ParsedData.pop()!;
const part2Operands = part1ParsedData.map((row) => row.map((operand) => Number.parseInt(operand)));

let part1Sum = 0;

for (const [column, operator] of part1Operators.entries()) {
    let result = part2Operands[0][column];

    for (const row of part2Operands.slice(1))
        if (operator === '*') result *= row[column];
        else result += row[column];

    part1Sum += result;
}

export { part1Sum };

// Part Two
const part2ParsedData = data.split('\n');

const part2Operators = part2ParsedData.pop()!;
const operatorIndices = [...part2Operators].map((operator, index) => (operator === ' ' ? -1 : index)).filter((index) => index !== -1);

let part2Sum = 0;

for (const [operatorColumnIndex, operatorIndex] of operatorIndices.entries()) {
    const nextOperator =
        operatorColumnIndex === operatorIndices.length - 1 ? part2Operators.length + 1 : operatorIndices[operatorColumnIndex + 1];

    const operandCount = nextOperator - operatorIndex - 1;

    const operands = Array.from<number[]>({ length: operandCount });

    for (let columnIndex = 0; columnIndex < operandCount; columnIndex++) {
        operands[columnIndex] = [];
        for (const row of part2ParsedData) {
            let columnValue = row[operatorIndex + columnIndex];
            if (columnValue === ' ') columnValue = '0';

            operands[columnIndex].push(Number.parseInt(columnValue));
        }
    }

    const joinedOperands = operands.map((operandDigits) => {
        while (operandDigits.at(-1) === 0) operandDigits.pop();

        return Number.parseInt(operandDigits.join(''));
    });

    let result = joinedOperands[0];
    for (const operand of joinedOperands.slice(1))
        if (part2Operators[operatorIndex] === '*') result *= operand;
        else result += operand;

    part2Sum += result;
}

export default part2Sum;
