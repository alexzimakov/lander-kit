import { mergeConfig } from 'vite';

/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  docs: {
    autodocs: 'tag',
  },

  /**
   *
   * @param { import('vite').UserConfig } config
   * @returns { import('vite').UserConfig }
   */
  async viteFinal(config) {
    return mergeConfig(config, {
      server: {
        hmr: false,
      },
    });
  },
};
export default config;
