const data = await Bun.file('./challenges/2024/1/data.txt').text();

// Part One
const leftLocations = [];
const rightLocations = [];

for (const line of data.split('\n')) {
    const [left, right] = line.split('   ');

    leftLocations.push(Number.parseInt(left));
    rightLocations.push(Number.parseInt(right));
}

leftLocations.sort();
rightLocations.sort();

let totalDistances = 0;

for (let index = 0; index < leftLocations.length; index++) totalDistances += Math.abs(leftLocations[index] - rightLocations[index]);

export { totalDistances };

// Part Two
const rightOccurrences: Record<number, number> = {};

for (const location of rightLocations)
    if (location in rightOccurrences) rightOccurrences[location]++;
    else rightOccurrences[location] = 1;

let similarityScore = 0;

for (const location of leftLocations) similarityScore += location * (rightOccurrences[location] ?? 0);

export default similarityScore;
