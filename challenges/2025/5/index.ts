const data = await Bun.file('./challenges/2025/5/data.txt').text();

const IS_PART_ONE = false;

const [rawRanges, rawIds] = data.split('\n\n').map((group) => group.split('\n'));

const ranges = rawRanges.map((rawRange) => rawRange.split('-').map((endpoint) => Number.parseInt(endpoint))).sort((a, b) => a[0] - b[0]);
const ids = rawIds.map((rawId) => Number.parseInt(rawId));

// Part One
let freshIngredientCount = 0;

for (const id of ids)
    for (const range of ranges)
        if (id >= range[0] && id <= range[1]) {
            freshIngredientCount++;
            break;
        }

// Part Two
const merged = [];

for (const [start, end] of ranges) {
    if (merged.length === 0) {
        merged.push([start, end]);
        continue;
    }

    const last = merged.at(-1)!;

    if (start <= last[1] + 1) last[1] = Math.max(last[1], end);
    else merged.push([start, end]);
}

const totalFreshIngredients = merged.reduce((accumulator, [start, end]) => accumulator + (end - start + 1), 0);

export default IS_PART_ONE ? freshIngredientCount : totalFreshIngredients; // eslint-disable-line @typescript-eslint/no-unnecessary-condition
