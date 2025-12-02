const data = await Bun.file('./challenges/2024/23/data.txt').text();

const edges = new Set(data.split('\n'));

const vertices = new Set<string>();

for (const edge of edges) {
    const [from, to] = edge.split('-');
    vertices.add(from);
    vertices.add(to);
}

// Part One
const triangleGroups = new Set<string>();

for (const edge of edges)
    for (const vertex of vertices) {
        const [edgeStart, edgeEnd] = edge.split('-');

        if (
            (edges.has(`${vertex}-${edgeStart}`) || edges.has(`${edgeStart}-${vertex}`)) &&
            (edges.has(`${vertex}-${edgeEnd}`) || edges.has(`${edgeEnd}-${vertex}`))
        )
            triangleGroups.add([vertex, edgeStart, edgeEnd].sort().join(','));
    }

const triangleGroupsWithT = new Set<string>();

for (const triangleGroup of triangleGroups)
    if (triangleGroup.split(',').some((computer) => computer.startsWith('t'))) triangleGroupsWithT.add(triangleGroup);

export const partOne = triangleGroupsWithT.size;

// Part Two
const cliques: Set<string>[] = [];

/**
 * Performs the Bron-Kerbosch algorithm on a graph.
 * @param clique The current clique.
 * @param potential The potential vertices to add to the clique.
 * @param added The vertices that have already been added to the clique.
 */
function bronKerbosch(clique: Set<string>, potential: Set<string>, added: Set<string>) {
    if (potential.size === 0 && added.size === 0) {
        cliques.push(clique);
        return;
    }

    const pivot = potential.union(added).values().next().value;
    const pivotNeighbors = new Set<string>();

    for (const edge of edges) {
        const [from, to] = edge.split('-');

        if (from === pivot) pivotNeighbors.add(to);
        if (to === pivot) pivotNeighbors.add(from);
    }

    for (const vertex of potential.difference(pivotNeighbors)) {
        const vertexNeighbors = new Set<string>();

        for (const edge of edges) {
            const [from, to] = edge.split('-');

            if (from === vertex) vertexNeighbors.add(to);
            if (to === vertex) vertexNeighbors.add(from);
        }

        bronKerbosch(clique.union(new Set([vertex])), potential.intersection(vertexNeighbors), added.intersection(vertexNeighbors));

        potential = potential.difference(new Set([vertex]));
        added = added.union(new Set([vertex]));
    }
}

bronKerbosch(new Set(), vertices, new Set());

let maximumClique = cliques[0];

for (const clique of cliques) if (clique.size > maximumClique.size) maximumClique = clique;

const password = maximumClique.values().toArray().sort().join(',');

export default password;
