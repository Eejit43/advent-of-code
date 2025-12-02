const data = await Bun.file('./challenges/2024/22/data.txt').text();

const startingSecrets = data.split('\n').map(BigInt);

/**
 * "Mixes" the secret number and a given number, returning the bitwise XOR.
 * @param secret The secret number.
 * @param given The given number.
 */
function mix(secret: bigint, given: bigint) {
    return secret ^ given;
}

/**
 * "Prunes" the secret number by taking the modulo of it and 16,777,216.
 * @param secret The secret number.
 */
function prune(secret: bigint) {
    return secret % 16_777_216n;
}

/**
 * Gets the next secret number in the sequence.
 * @param secret The secret number.
 */
function getNextSecret(secret: bigint) {
    secret = prune(mix(secret, secret * 64n));
    secret = prune(mix(secret, secret / 32n));
    secret = prune(mix(secret, secret * 2048n));

    return secret;
}

const allPrices = [];
const allPricesMap = new Map<string, bigint>();

let total = 0n;

for (let secret of startingSecrets) {
    const prices = [secret % 10n];
    const priceChanges = [];
    const priceMap = new Map<string, bigint>();

    for (let index = 0; index < 2000; index++) {
        secret = getNextSecret(secret);

        prices.push(secret % 10n);
        priceChanges.push(prices.at(-1)! - prices.at(-2)!);
    }

    allPrices.push(prices);

    for (let index = 4; index <= priceChanges.length; index++) {
        const sequence = priceChanges.slice(index - 4, index).join(',');
        const finalPrice = prices[index];

        if (!priceMap.has(sequence)) priceMap.set(sequence, finalPrice);
    }
    for (const [sequence, price] of priceMap.entries())
        if (allPricesMap.has(sequence)) allPricesMap.set(sequence, price + allPricesMap.get(sequence)!);
        else allPricesMap.set(sequence, price);

    total += secret;
}

// Part One
export { total };

// Part Two
export default allPricesMap
    .entries()
    .toArray()
    .sort((a, b) => Number(b[1] - a[1]))[0][1];
