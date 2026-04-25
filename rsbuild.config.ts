import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginBasicSsl } from '@rsbuild/plugin-basic-ssl';

const path = require('path');

// Conditionally include SSL plugin only for local development
const isVercel = process.env.VERCEL === 'true';
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
    plugins: [
        pluginSass({
            sassLoaderOptions: {
                sourceMap: !isProduction,
                sassOptions: {
                    // includePaths: [path.resolve(__dirname, 'src')],
                },
                // additionalData: `@use "${path.resolve(__dirname, 'src/components/shared/styles')}" as *;`,
            },
            exclude: /node_modules/,
        }),
        pluginReact(),
        // Only use basic SSL plugin in local development
        ...(!isVercel && !isProduction ? [pluginBasicSsl()] : []),
    ],
    source: {
        entry: {
            index: './src/main.tsx',
        },
        define: {
            'process.env': {
                TRANSLATIONS_CDN_URL: JSON.stringify(process.env.TRANSLATIONS_CDN_URL || ''),
                R2_PROJECT_NAME: JSON.stringify(process.env.R2_PROJECT_NAME || ''),
                CROWDIN_BRANCH_NAME: JSON.stringify(process.env.CROWDIN_BRANCH_NAME || ''),
                TRACKJS_TOKEN: JSON.stringify(process.env.TRACKJS_TOKEN || ''),
                APP_ENV: JSON.stringify(process.env.APP_ENV || 'production'),
                REF_NAME: JSON.stringify(process.env.REF_NAME || ''),
                REMOTE_CONFIG_URL: JSON.stringify(process.env.REMOTE_CONFIG_URL || ''),
                GD_CLIENT_ID: JSON.stringify(process.env.GD_CLIENT_ID || ''),
                GD_APP_ID: JSON.stringify(process.env.GD_APP_ID || ''),
                GD_API_KEY: JSON.stringify(process.env.GD_API_KEY || ''),
                DATADOG_SESSION_REPLAY_SAMPLE_RATE: JSON.stringify(process.env.DATADOG_SESSION_REPLAY_SAMPLE_RATE || ''),
                DATADOG_SESSION_SAMPLE_RATE: JSON.stringify(process.env.DATADOG_SESSION_SAMPLE_RATE || ''),
                DATADOG_APPLICATION_ID: JSON.stringify(process.env.DATADOG_APPLICATION_ID || ''),
                DATADOG_CLIENT_TOKEN: JSON.stringify(process.env.DATADOG_CLIENT_TOKEN || ''),
                RUDDERSTACK_KEY: JSON.stringify(process.env.RUDDERSTACK_KEY || ''),
                GROWTHBOOK_CLIENT_KEY: JSON.stringify(process.env.GROWTHBOOK_CLIENT_KEY || ''),
                GROWTHBOOK_DECRYPTION_KEY: JSON.stringify(process.env.GROWTHBOOK_DECRYPTION_KEY || ''),
                // Add Vercel-specific environment variables
                VERCEL: JSON.stringify(process.env.VERCEL || false),
                VERCEL_ENV: JSON.stringify(process.env.VERCEL_ENV || ''),
                VERCEL_URL: JSON.stringify(process.env.VERCEL_URL || ''),
            },
        },
        alias: {
            react: path.resolve('./node_modules/react'),
            'react-dom': path.resolve('./node_modules/react-dom'),
            '@/external': path.resolve(__dirname, './src/external'),
            '@/components': path.resolve(__dirname, './src/components'),
            '@/hooks': path.resolve(__dirname, './src/hooks'),
            '@/utils': path.resolve(__dirname, './src/utils'),
            '@/constants': path.resolve(__dirname, './src/constants'),
            '@/stores': path.resolve(__dirname, './src/stores'),
        },
    },
    output: {
        copy: [
            {
                from: 'node_modules/@deriv/deriv-charts/dist/*',
                to: 'js/smartcharts/[name][ext]',
                globOptions: {
                    ignore: ['**/*.LICENSE.txt'],
                },
            },
            { from: 'node_modules/@deriv/deriv-charts/dist/chart/assets/*', to: 'assets/[name][ext]' },
            { from: 'node_modules/@deriv/deriv-charts/dist/chart/assets/fonts/*', to: 'assets/fonts/[name][ext]' },
            { from: 'node_modules/@deriv/deriv-charts/dist/chart/assets/shaders/*', to: 'assets/shaders/[name][ext]' },
            { from: path.join(__dirname, 'public') },
        ],
        cleanDistPath: true,
    },
    html: {
        template: './index.html',
    },
    server: {
        port: 8443,
        compress: true,
    },
    dev: {
        hmr: true,
    },
    tools: {
        rspack: {
            plugins: [],
            resolve: {},
            module: {
                rules: [
                    {
                        test: /\.xml$/,
                        exclude: /node_modules/,
                        use: 'raw-loader',
                    },
                ],
            },
        },
    },
});
