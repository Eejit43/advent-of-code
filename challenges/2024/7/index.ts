const data = await Bun.file('./challenges/2024/7/data.txt').text();

const rows = data.split('\n');

// Part One
let possibleResultsSum = 0;

const impossibleExpressions: [number, number[]][] = [];

for (const row of rows) {
    const result = Number.parseInt(row.split(': ')[0]);
    const numbers = row
        .split(': ')[1]
        .split(' ')
        .map((number) => Number.parseInt(number));

    if (isPossible(result, numbers)) possibleResultsSum += result;
    else impossibleExpressions.push([result, numbers]);
}

/**
 * Determines if a desired result is possible to option from a given group of numbers.
 * @param result The desired result.
 * @param numbers The numbers to be used in the expression.
 * @param hasConcatenation Whether to support concatenation as an operator.
 */
function isPossible(result: number, numbers: number[], hasConcatenation = false): boolean {
    if (numbers.length === 1) return result === numbers[0];

    const lastNumber = numbers.at(-1)!;
    const remainingNumbers = numbers.slice(0, -1);

    if (
        (result % lastNumber === 0 ? isPossible(result / lastNumber, remainingNumbers, hasConcatenation) : false) ||
        isPossible(result - lastNumber, remainingNumbers, hasConcatenation)
    )
        return true;

    if (hasConcatenation) {
        const resultString = result.toString();
        const lastNumberString = lastNumber.toString();

        if (resultString.endsWith(lastNumberString)) {
            const resultWithoutLastNumber = Number.parseInt(resultString.slice(0, -lastNumberString.length));

            return isPossible(resultWithoutLastNumber, remainingNumbers, true);
        }
    }

    return false;
}

export { possibleResultsSum };

// Part Two
let possibleWithConcatenationSum = possibleResultsSum;

for (const [result, numbers] of impossibleExpressions) if (isPossible(result, numbers, true)) possibleWithConcatenationSum += result;

export default possibleWithConcatenationSum;
