/* eslint-disable no-console */

import { Glob } from 'bun';
import chalk from 'chalk';

const year = new Date().getFullYear();

const glob = new Glob(`challenges/${year}/**/index.ts`);

const files = await Array.fromAsync(glob.scan('.'));

const mostRecentFile = files.sort((a, b) => {
    const aNumber = /\d{4}\/(\d{1,2})/.exec(a)![1];
    const bNumber = /\d{4}\/(\d{1,2})/.exec(b)![1];

    return Number(bNumber) - Number(aNumber);
})[0];

const snowflake = chalk.blue('❄️');

console.log(`${snowflake} ${chalk.green('Happy')} ${chalk.red('Holidays!')} ${snowflake}`);

console.log(
    chalk.green(
        `\nThe most recent ${year} challenge with data is the challenge for day ${chalk.yellow(/\d{4}\/(\d{1,2})/.exec(mostRecentFile)![1])}. Here are the results:\n`,
    ),
);

console.log(chalk.cyan(((await import(`./${mostRecentFile}`)) as { default: string }).default));
