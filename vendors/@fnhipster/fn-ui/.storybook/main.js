/** @type { import('@storybook/html-vite').StorybookConfig } */
const config = {
  stories: [
    "../**/*.mdx",
    "../**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: [{ from: '../styles', to: '/styles' }],
  previewHead: (head) => `
    ${head}
    <link rel="stylesheet" href="styles/fn.css">
    <link rel="stylesheet" href="https://use.typekit.net/joe8rol.css">

    <style>
      body {
        font-size: 18px;
      }
    </style>
`,
};
export default config;

