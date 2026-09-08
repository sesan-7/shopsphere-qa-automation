import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '.env')
});

export default defineConfig({
    testDir: './tests',

    timeout: 30 * 1000,

    expect: {
        timeout: 10 * 1000
    },

    fullyParallel: true,

    retries: process.env.CI ? 2 : 0,

    reporter: [
        ['html', {
            outputFolder: 'playwright-report',
            open: 'never'
        }],
        ['list']
    ],

    use: {
        baseURL: 'https://shop-sphere-mern-ecommerce.vercel.app',
        trace: 'on-first-failure',
        video: 'retain-on-failure',
        headless: true
    },

    projects: [
        {
            name: 'setup',
            testMatch: /.*\.setup\.js/
        },

        {
            name: 'authenticated',
            testMatch: /.*\.auth\.spec\.js/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'playwright/.auth/user.json'
            },
            dependencies: ['setup']
        },

        {
            name: 'unauthenticated',
            testMatch: /.*\.spec\.js/,
            testIgnore: /.*\.auth\.spec\.js/
        }
    ]
});