const data = await Bun.file('./challenges/2025/12/data.txt').text();

const splitData = data.split('\n\n');

const trees = splitData
    .pop()!
    .split('\n')
    .map((tree) => {
        const [dimensions, rawPresentCount] = tree.split(': ');

        const [width, length] = dimensions.split('x').map(Number);

        const area = width * length;

        const presentCount = rawPresentCount.split(' ').map(Number);

        return { width, length, area, presentCount };
    });

const presents = splitData.map((present) => {
    const presentLayout = present.slice(1).split('\n');

    const area = presentLayout.flatMap((row) => [...row].filter((cell) => cell === '#')).length;

    return { area, presentLayout };
});

let fittingTrees = 0;

for (const tree of trees) {
    const presentAreaSum = tree.presentCount
        .map((presentCount, index) => presents[index].area * presentCount)
        .reduce((accumulator, area) => accumulator + area, 0);

    if (presentAreaSum <= 0.85 * tree.area) fittingTrees++; // Heuristic check as mentioned on the AoC Reddit
}

export default fittingTrees;
