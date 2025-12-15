const data = await Bun.file('./challenges/2025/11/data.txt').text();

const IS_PART_ONE = false;

const nodeData = data.split('\n').map((line) => {
    const [node, edges] = line.split(': ');

    return { node, edges: edges.split(' ') };
});

const nodes = Object.fromEntries(nodeData.map((nodeData) => [nodeData.node, nodeData.edges]));

// Part 1
const part1Memo = new Map<string, number>();

/**
 * Get number of paths out from a given node.
 * @param node The node to get paths from.
 */
function getPathsOut(node: string) {
    if (part1Memo.has(node)) return part1Memo.get(node)!;

    let pathsOut = 0;

    for (const otherNode of nodes[node])
        if (otherNode === 'out') pathsOut++;
        else pathsOut += getPathsOut(otherNode);

    part1Memo.set(node, pathsOut);

    return pathsOut;
}

const pathsOutFromYou = getPathsOut('you');

// Part 2
const PART_2_REQUIRED = ['dac', 'fft'];

const part2Memo = new Map<string, number>();

/**
 * Get number of paths out from a given node, requiring certain nodes to be visited.
 * @param node The node to get paths from.
 * @param visited The nodes already visited.
 */
function getPathsOutPart2(node: string, visited: string[] = []) {
    visited.sort();

    const key = `${node}|${visited.join(',')}`;
    if (part2Memo.has(key)) return part2Memo.get(key)!;

    let pathsOut = 0;

    for (const otherNode of nodes[node]) {
        const nextVisited = [...visited];

        if (PART_2_REQUIRED.includes(otherNode) && !visited.includes(otherNode)) {
            nextVisited.push(otherNode);
            nextVisited.sort();
        }

        if (otherNode === 'out') {
            if (nextVisited.length === PART_2_REQUIRED.length) pathsOut++;
        } else pathsOut += getPathsOutPart2(otherNode, nextVisited);
    }

    part2Memo.set(key, pathsOut);
    return pathsOut;
}

const pathsOutFromSvr = getPathsOutPart2('svr');

export default IS_PART_ONE ? pathsOutFromYou : pathsOutFromSvr; // eslint-disable-line @typescript-eslint/no-unnecessary-condition
