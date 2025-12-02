const data = await Bun.file('./challenges/2024/14/data.txt').text();

const IS_PART_TWO = true;

const areaSize = { x: 101, y: 103 };
const regionBarriers = { x: Math.floor(areaSize.x / 2), y: Math.floor(areaSize.y / 2) };

const robots = data.split('\n').map((row) => {
    const data = /p=(?<positionX>-?\d{1,3}),(?<positionY>-?\d{1,3}) v=(?<velocityX>-?\d{1,3}),(?<velocityY>-?\d{1,3})/.exec(row)!.groups!;

    return {
        position: { x: Number.parseInt(data.positionX), y: Number.parseInt(data.positionY) },
        velocity: { x: Number.parseInt(data.velocityX), y: Number.parseInt(data.velocityY) },
    };
});

/**
 * Simulates a second, updating all robot positions.
 */
function simulateSecond() {
    for (const robot of robots) {
        robot.position.x = (robot.position.x + robot.velocity.x + areaSize.x) % areaSize.x;
        robot.position.y = (robot.position.y + robot.velocity.y + areaSize.y) % areaSize.y;
    }
}

let maxRobots = 0;
let maxRobotsSeconds = 0;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
for (let index = 0; index < (IS_PART_TWO ? 10_000 : 0); index++) {
    simulateSecond();

    const rows = Array.from({ length: areaSize.y }, () => 0);
    const columns = Array.from({ length: areaSize.x }, () => 0);

    for (const robot of robots) {
        rows[robot.position.y]++;
        columns[robot.position.x]++;
    }

    const maxRowRobots = Math.max(...rows);
    const maxColumnRobots = Math.max(...columns);

    const maxRobotsCurrent = maxRowRobots + maxColumnRobots;

    if (maxRobotsCurrent > maxRobots) {
        maxRobots = maxRobotsCurrent;
        maxRobotsSeconds = index + 1;
    }
}

const regionCounts = [
    [0, 0],
    [0, 0],
];

for (const robot of robots) {
    const { x, y } = robot.position;

    if (x === regionBarriers.x || y === regionBarriers.y) continue;

    const xRegion = x < regionBarriers.x ? 0 : 1;
    const yRegion = y < regionBarriers.y ? 0 : 1;

    regionCounts[yRegion][xRegion]++;
}

// Part One
const safetyFactor = regionCounts.flat().reduce((factor, count) => factor * count, 1);

export { safetyFactor };

// Part Two
export default maxRobotsSeconds;
