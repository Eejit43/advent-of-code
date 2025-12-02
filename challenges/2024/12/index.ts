const data = await Bun.file('./challenges/2024/12/data.txt').text();

const plants: Record<string, PlotLocation[]> = {};

for (const [rowIndex, row] of data.split('\n').entries())
    for (const [columnIndex, column] of [...row].entries())
        if (column in plants) plants[column].push([rowIndex, columnIndex]);
        else plants[column] = [[rowIndex, columnIndex]];

type PlotLocation = [number, number];

interface Plot {
    location: PlotLocation;
    neighbors: number;
}

const regions: Record<
    string,
    {
        plots: Plot[];
        area?: number;
        perimeter?: number;
        cost?: number;
        discountCost?: number;
    }[]
> = {};

for (const [plant, plots] of Object.entries(plants)) {
    regions[plant] = [];

    const added = new Set<string>();

    for (const plot of plots) {
        if (added.has(plot.join(','))) continue;

        const plotWithNeighbors = getPlotWithNeighbors(plot, plots, added);

        const area = plotWithNeighbors.length;
        const perimeter = plotWithNeighbors.reduce((perimeter, plot) => perimeter + 4 - plot.neighbors, 0);

        const corners = [];

        for (const plot of plotWithNeighbors) {
            const row = plot.location[0];
            const column = plot.location[1];

            const hasTop = added.has([row - 1, column].join(','));
            const hasBottom = added.has([row + 1, column].join(','));
            const hasLeft = added.has([row, column - 1].join(','));
            const hasRight = added.has([row, column + 1].join(','));

            if (!hasTop && !hasLeft) corners.push(plot);
            if (!hasTop && !hasRight) corners.push(plot);
            if (!hasBottom && !hasLeft) corners.push(plot);
            if (!hasBottom && !hasRight) corners.push(plot);

            if (hasTop && hasLeft && !added.has([row - 1, column - 1].join(','))) corners.push(plot);

            if (hasBottom && hasRight && !added.has([row + 1, column + 1].join(','))) corners.push(plot);

            if (hasTop && hasRight && !added.has([row - 1, column + 1].join(','))) corners.push(plot);

            if (hasBottom && hasLeft && !added.has([row + 1, column - 1].join(','))) corners.push(plot);
        }

        regions[plant].push({ plots: plotWithNeighbors, area, perimeter, cost: area * perimeter, discountCost: area * corners.length });
    }
}

/**
 * Returns the given plot and all of its neighbors.
 * @param plot The plot to fetch.
 * @param plots The plots to search.
 * @param added The set of already added plots.
 */
function getPlotWithNeighbors(plot: PlotLocation, plots: PlotLocation[], added: Set<string>) {
    const plotWithNeighbors: Plot[] = [{ location: plot, neighbors: 0 }];

    if (added.has(plot.join(','))) return [];

    added.add(plot.join(','));

    for (const otherPlot of plots) {
        const rowOffset = Math.abs(plot[0] - otherPlot[0]);
        const columnOffset = Math.abs(plot[1] - otherPlot[1]);

        if ((rowOffset === 1 && columnOffset === 0) || (rowOffset === 0 && columnOffset === 1)) {
            const neighbors = getPlotWithNeighbors(otherPlot, plots, added);

            plotWithNeighbors.push(...neighbors);
        }
    }

    for (const plot of plotWithNeighbors) {
        const neighbors = plotWithNeighbors.filter((neighborPlot) => {
            const rowOffset = Math.abs(plot.location[0] - neighborPlot.location[0]);
            const columnOffset = Math.abs(plot.location[1] - neighborPlot.location[1]);

            return (rowOffset === 1 && columnOffset === 0) || (rowOffset === 0 && columnOffset === 1);
        });

        plot.neighbors = neighbors.length;
    }

    return plotWithNeighbors;
}

// Part One
const partOneCost = Object.values(regions)
    .flatMap((regions) => regions.map((region) => region.cost!))
    .reduce((total, cost) => total + cost, 0);

export { partOneCost };

// Part Two
const partTwoCost = Object.values(regions)
    .flatMap((regions) => regions.map((region) => region.discountCost!))
    .reduce((total, cost) => total + cost, 0);

export default partTwoCost;
