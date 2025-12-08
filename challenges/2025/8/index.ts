const data = await Bun.file('./challenges/2025/8/data.txt').text();

const IS_PART_ONE = false;

const MAX_ITERATIONS = 1000;

interface Junction {
    id: string;
    x: number;
    y: number;
    z: number;
}

const junctions: Junction[] = data.split('\n').map((line) => {
    const split = line.split(',').map((number) => Number.parseInt(number));

    return { id: line, x: split[0], y: split[1], z: split[2] };
});

const pairs: { junction1: Junction; junction2: Junction; distance: number }[] = [];

for (const [junctionIndex, junction] of junctions.entries())
    for (const otherJunction of junctions.slice(junctionIndex + 1)) {
        if (junction === otherJunction) continue;

        const distance = getEuclideanDistance(junction, otherJunction);

        pairs.push({ junction1: junction, junction2: otherJunction, distance });
    }

/**
 * Gets the Euclidean distance between two junctions.
 * @param junction1 The first junction.
 * @param junction2 The second junction.
 */
function getEuclideanDistance(junction1: Junction, junction2: Junction) {
    return Math.hypot(junction1.x - junction2.x, junction1.y - junction2.y, junction1.z - junction2.z);
}

pairs.sort((a, b) => a.distance - b.distance);

const parentMapping = new Map<string, string>();
const sizeMapping = new Map<string, number>();

for (const junction of junctions) {
    parentMapping.set(junction.id, junction.id);
    sizeMapping.set(junction.id, 1);
}

/**
 * Finds the parent junction ID for the given junction ID.
 * @param junctionId The junction ID to find the parent for.
 */
function find(junctionId: string) {
    let junctionParentId = parentMapping.get(junctionId)!;

    if (junctionParentId !== junctionId) {
        junctionParentId = find(junctionParentId);
        parentMapping.set(junctionId, junctionParentId);
    }

    return junctionParentId;
}

/**
 * Unions two junctions together.
 * @param junction1Id The first junction ID.
 * @param junction2Id The second junction ID.
 */
function union(junction1Id: string, junction2Id: string) {
    const junction1ParentId = find(junction1Id);
    const junction2ParentId = find(junction2Id);
    if (junction1ParentId === junction2ParentId) return false;

    const junction1ParentSize = sizeMapping.get(junction1ParentId)!;
    const junction2ParentSize = sizeMapping.get(junction2ParentId)!;
    if (junction1ParentSize < junction2ParentSize) {
        parentMapping.set(junction1ParentId, junction2ParentId);
        sizeMapping.set(junction2ParentId, junction1ParentSize + junction2ParentSize);
        sizeMapping.delete(junction1ParentId);
    } else {
        parentMapping.set(junction2ParentId, junction1ParentId);
        sizeMapping.set(junction1ParentId, junction1ParentSize + junction2ParentSize);
        sizeMapping.delete(junction2ParentId);
    }
    return true;
}

let last2Junctions: [Junction, Junction] | undefined;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
if (IS_PART_ONE) for (const pair of pairs.slice(0, MAX_ITERATIONS)) union(pair.junction1.id, pair.junction2.id);
else
    for (const pair of pairs) {
        union(pair.junction1.id, pair.junction2.id);
        if (sizeMapping.size === 1) {
            last2Junctions = [pair.junction1, pair.junction2];
            break;
        }
    }

// Gather component sizes and compute product of top 3
const sizes = [...sizeMapping.values()].sort((a, b) => b - a);
const top3 = [sizes[0] ?? 1, sizes[1] ?? 1, sizes[2] ?? 1];
const top3Product = top3[0] * top3[1] * top3[2];

export default IS_PART_ONE ? top3Product : last2Junctions![0].x * last2Junctions![1].x; // eslint-disable-line @typescript-eslint/no-unnecessary-condition
