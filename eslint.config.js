// @ts-check

import sharedConfig from '@eejit/eslint-config-typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(
    globalIgnores(['challenges/2024/*', 'challenges/2025/*']), //
    sharedConfig,
    {
        languageOptions: { parserOptions: { project: ['./tsconfig.json'] } },
        rules: {
            '@typescript-eslint/no-misused-spread': 'off',
            'unicorn/no-array-sort': 'off',
        },
    },
);
