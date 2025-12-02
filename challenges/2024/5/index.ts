const data = await Bun.file('./challenges/2024/5/data.txt').text();

const [rawRules, rawPages] = data.split('\n\n');

const rulesSplit = rawRules.split('\n').map((row) => row.split('|'));

const rules = new Map<string, string[]>();

for (const [before, after] of rulesSplit)
    if (rules.has(before)) rules.get(before)!.push(after);
    else rules.set(before, [after]);

const updates = rawPages.split('\n').map((row) => row.split(','));

// Part One
let middlePageNumberSum = 0;

const invalidUpdates = [];

for (const update of updates) {
    let isValid = true;

    for (const [pageIndex, pageNumber] of update.entries())
        for (const followingPage of rules.get(pageNumber) ?? []) {
            const followingPageIndex = update.indexOf(followingPage);

            if (followingPageIndex !== -1 && followingPageIndex < pageIndex) {
                isValid = false;

                break;
            }
        }

    if (isValid) middlePageNumberSum += Number.parseInt(update[Math.floor(update.length / 2)]);
    else invalidUpdates.push(update);
}

export { middlePageNumberSum };

// Part Two

let fixedMiddlePageNumberSum = 0;

for (const update of invalidUpdates) {
    update.sort((a, b) => {
        if (!rules.get(a)?.includes(b)) return 0;

        return -1;
    });

    fixedMiddlePageNumberSum += Number.parseInt(update[Math.floor(update.length / 2)]);
}

export default fixedMiddlePageNumberSum;
