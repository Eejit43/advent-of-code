const data = await Bun.file('./challenges/2024/13/data.txt').text();

const IS_PART_TWO = true;

const machines = data.split('\n\n').map((machine) => {
    const data =
        /Button A: X\+(?<aXOffset>\d{2}), Y\+(?<aYOffset>\d{2})\nButton B: X\+(?<bXOffset>\d{2}), Y\+(?<bYOffset>\d{2})\nPrize: X=(?<prizeX>\d{3,5}), Y=(?<prizeY>\d{3,5})/.exec(
            machine,
        )!.groups!;

    const prizeOffset = IS_PART_TWO ? 10_000_000_000_000 : 0; // eslint-disable-line @typescript-eslint/no-unnecessary-condition

    return {
        a: { x: Number.parseInt(data.aXOffset), y: Number.parseInt(data.aYOffset) },
        b: { x: Number.parseInt(data.bXOffset), y: Number.parseInt(data.bYOffset) },
        prize: { x: Number.parseInt(data.prizeX) + prizeOffset, y: Number.parseInt(data.prizeY) + prizeOffset },
    };
});

let tokensUsed = 0;

for (const machine of machines) {
    const { a, b, prize } = machine;

    const bPresses = (a.x * prize.y - prize.x * a.y) / (a.x * b.y - b.x * a.y);
    const aPresses = (prize.x - bPresses * b.x) / a.x;

    if (Number.isInteger(aPresses) && Number.isInteger(bPresses)) tokensUsed += aPresses * 3 + bPresses;
}

export default tokensUsed;
