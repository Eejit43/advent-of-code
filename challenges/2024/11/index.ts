const data = await Bun.file('./challenges/2024/11/data.txt').text();

const stonesOriginal = data.split(' ').map((number) => Number.parseInt(number));

let stones = [...stonesOriginal];

/**
 * Simulates a "blink", modifying the stones as following:
 *
 * - If the stone is engraved with the number `0`, it is replaced by a stone engraved with the number `1`.
 * - If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: `1000` would become stones `10` and `0`.)
 * - If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by `2024` is engraved on the new stone.
 */
function blink() {
    const newStones = [];

    for (const stone of stones)
        if (stone === 0) newStones.push(1);
        else if (stone.toString().length % 2 === 0) {
            const stoneString = stone.toString();

            const leftStone = Number.parseInt(stoneString.slice(0, stoneString.length / 2));
            const rightStone = Number.parseInt(stoneString.slice(stoneString.length / 2));

            newStones.push(leftStone, rightStone);
        } else newStones.push(stone * 2024);

    stones = newStones;
}

// Part One
for (let index = 0; index < 25; index++) blink();

export const partOneLength = stones.length;

// Part Two
const knownLengths = new Map<number, Record<number, number>>();

/**
 * Gets the amount of stones a stone will be split into after a given amount of blinks.
 * @param stone The stone to get the length for.
 * @param blinks The blinks to simulate.
 */
function getStoneLength(stone: number, blinks: number) {
    if (blinks === 0) return 1;

    const cachedLength = knownLengths.get(blinks)?.[stone];
    if (cachedLength) return cachedLength;

    let result: number;
    if (stone === 0) result = getStoneLength(1, blinks - 1);
    else if (stone.toString().length % 2 === 0) {
        const stoneString = stone.toString();

        const leftStone = Number.parseInt(stoneString.slice(0, stoneString.length / 2));
        const rightStone = Number.parseInt(stoneString.slice(stoneString.length / 2));

        result = getStoneLength(leftStone, blinks - 1) + getStoneLength(rightStone, blinks - 1);
    } else result = getStoneLength(stone * 2024, blinks - 1);

    if (knownLengths.get(blinks)) knownLengths.get(blinks)![stone] = result;
    else knownLengths.set(blinks, { [stone]: result });

    return result;
}

const finalLengths = stonesOriginal.map((stone) => getStoneLength(stone, 75));

export default finalLengths.reduce((accumulator, length) => accumulator + length, 0);
