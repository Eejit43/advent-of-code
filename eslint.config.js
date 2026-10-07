// @ts-check

import sharedConfig from '@eejit/eslint-config-typescript';
import { defineConfig, globalIgnores } from 'eslint/config';
import { readdirSync } from 'node:fs';

const currentYear = new Date().getFullYear();

const oldChallengeYears = readdirSync('challenges').filter((year) => year != currentYear.toString());

const ignoredChallengeGlobs = oldChallengeYears.map((year) => `challenges/${year}/*`);

export default defineConfig(
    globalIgnores(ignoredChallengeGlobs), //
    sharedConfig,
    {
        languageOptions: { parserOptions: { project: ['./tsconfig.json'] } },
        rules: {
            '@typescript-eslint/no-misused-spread': 'off',
            'unicorn/no-array-sort': 'off',
        },
    },
);
