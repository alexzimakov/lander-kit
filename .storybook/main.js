/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  core: {
    disableTelemetry: true,
  },
  staticDirs: [
    '../public',
  ],
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/html-vite',
    options: {},
  },
};

export default config;
