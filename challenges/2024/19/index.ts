const data = await Bun.file('./challenges/2024/19/data.txt').text();

const [rawPatterns, rawDesigns] = data.split('\n\n');

const patterns = rawPatterns.split(', ');

const designs = rawDesigns.split('\n');

const countedDesigns = new Map<string, number>([['', 1]]);

/**
 * Gets the possible paths to reach a given design.
 * @param design The design to reach.
 * @param count The current path count.
 */
function getPathCountForDesign(design: string, count = 0) {
    if (countedDesigns.has(design)) return countedDesigns.get(design)!;

    for (const pattern of patterns) if (design.startsWith(pattern)) count += getPathCountForDesign(design.slice(pattern.length));

    countedDesigns.set(design, count);

    return count;
}

// Part One
const possibleDesigns = designs.map((design) => getPathCountForDesign(design)).filter((count) => count > 0);

export const possibleDesignCount = possibleDesigns.length;

// Part Two
export default possibleDesigns.reduce((accumulator, count) => accumulator + count, 0);
