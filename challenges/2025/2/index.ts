const data = await Bun.file('./challenges/2025/2/data.txt').text();

const IS_PART_ONE = false;

const ranges = data.split(',').map((range) => range.split('-').map((endpoint) => Number.parseInt(endpoint)));

let sumOfInvalidIds = 0;

for (const [start, end] of ranges) for (let index = start; index <= end; index++) if (isInvalidId(index)) sumOfInvalidIds += index;

/**
 * Checks if a given ID is a sequence of repeated digits.
 * @param id The ID to check.
 */
function isInvalidId(id: number) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (IS_PART_ONE) {
        const idString = id.toString();

        if (idString.length % 2 !== 0) return false;

        const firstHalf = idString.slice(0, idString.length / 2);
        const secondHalf = idString.slice(idString.length / 2);

        return firstHalf === secondHalf;
    } else {
        const idString = id.toString();

        for (let substringSize = 1; substringSize <= idString.length / 2; substringSize++) {
            const splitString = idString.match(new RegExp(`.{1,${substringSize}}`, 'g'));
            const splitStringSet = new Set(splitString);

            if (splitStringSet.size === 1) return true;
        }

        return false;
    }
}

export default sumOfInvalidIds;
