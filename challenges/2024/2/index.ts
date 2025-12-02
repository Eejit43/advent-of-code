const data = await Bun.file('./challenges/2024/2/data.txt').text();

const reports = data.split('\n').map((report) => report.split(' ').map((number) => Number.parseInt(number)));

// Part One
let safeReports = 0;

for (const report of reports) {
    let isIncreasing;

    for (let index = 1; index < report.length; index++) {
        const previous = report[index - 1];
        const current = report[index];

        const difference = current - previous;

        if (isIncreasing === undefined) isIncreasing = difference > 0;
        else if (isIncreasing !== difference > 0) break;

        const absoluteDifference = Math.abs(difference);

        if (absoluteDifference < 1 || absoluteDifference > 3) break;

        if (index === report.length - 1) safeReports++;
    }
}

export { safeReports };

// Part Two
let safeReportsWithDampener = 0;

for (const report of reports) {
    const possibleReports = [
        report,
        ...Array.from({ length: report.length }).map((possibleReport, index) => {
            const leftSide = report.slice(0, index);
            const rightSide = report.slice(index + 1);

            return [...leftSide, ...rightSide];
        }),
    ];

    for (const possibleReport of possibleReports) {
        let isIncreasing;

        let isValid = false;

        for (let index = 1; index < possibleReport.length; index++) {
            const previous = possibleReport[index - 1];
            const current = possibleReport[index];

            const difference = current - previous;

            if (isIncreasing === undefined) isIncreasing = difference > 0;
            else if (isIncreasing !== difference > 0) break;

            const absoluteDifference = Math.abs(difference);

            if (absoluteDifference < 1 || absoluteDifference > 3) break;

            if (index === possibleReport.length - 1) isValid = true;
        }

        if (isValid) {
            safeReportsWithDampener++;

            break;
        }
    }
}

export default safeReportsWithDampener;
