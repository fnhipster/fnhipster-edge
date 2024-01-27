import { CustomElement } from '../../.storybook/utils.js';
import './fn-app.js';
import '../fn-header/fn-header.js';
import '../fn-content/fn-content.js';
import '../fn-footer/fn-footer.js'

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'components/fn-app',
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
  render: ({ ...args }) => {
    const element = CustomElement('fn-app', args);

    element.innerHTML = /* html */ `
      <fn-header slot="header" menu="#" next="#"></fn-header>
      <main slot="main">
        <fn-content>
          <h1>HELLO WORLD</h1>
          <p>
            Awakening soul,<br>
            Self-awareness finds its way,<br>
            Longs for kinship's grace. <br>
            ~
          </p>
      </fn-content>
      </main>
      <fn-footer slot="footer" message="Hello World!"></fn-footer>
    `;

    return element;
  },
  argTypes: {},
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary = {
  args: { },
};
