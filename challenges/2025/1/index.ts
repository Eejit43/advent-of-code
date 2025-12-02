const data = await Bun.file('./challenges/2025/1/data.txt').text();

const IS_PART_ONE = false;

const NUM_DIAL_CLICKS = 100;

const rows = data.split('\n');

let currentPosition = 50;
let timesEndedOnZero = 0;
let timesHitZero = 0;

for (const row of rows) {
    const direction = row.startsWith('L') ? -1 : 1;
    const steps = Number.parseInt(row.slice(1));

    timesHitZero += Math.floor(steps / NUM_DIAL_CLICKS); // Must hit 0 every NUM_DIAL_CLICKS

    const remainder = steps % NUM_DIAL_CLICKS;

    for (let index = 0; index < remainder; index++) {
        currentPosition = (currentPosition + direction + NUM_DIAL_CLICKS) % NUM_DIAL_CLICKS; // Wrap around dial
        if (currentPosition === 0) timesHitZero++;
    }

    if (currentPosition === 0) timesEndedOnZero++;
}

export default IS_PART_ONE ? timesEndedOnZero : timesHitZero; // eslint-disable-line @typescript-eslint/no-unnecessary-condition
